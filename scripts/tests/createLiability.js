const assert = require("assert");

const { TonClient, signerNone, signerKeys, signerExternal, abiContract,
  builderOpInteger, builderOpCell, builderOpCellBoc, builderOpBitString } = require("@tonclient/core");
const { Account } = require("@tonclient/appkit");
const { libNode } = require("@tonclient/lib-node");

const fs = require('fs');
const path = require('path');
const keysFile = path.join(__dirname, '../keys.json');

const { get_tokens_from_giver } = require('../giverConfig.js')

const config = require('../config');

const { LighthouseContract } = require('../../artifacts/LighthouseContract.js');
const { RootContract } = require('../../artifacts/RootContract.js');
const { XRTContract } = require('../../artifacts/XRTContract.js');
const { SimpleWalletContract } = require('../../artifacts/SimpleWalletContract.js')

const { constructContracts, getLighthouseAddress } = require('../common.js')

const u = (size, x) => {
    if (size === 256) {
        return builderOpBitString(`x${BigInt(x).toString(16).padStart(64, "0")}`)
    } else {
        return builderOpInteger(size, x);
    }
}
const u8 = x => u(8, x);
const u32 = x => u(32, x);
const u64 = x => u(64, x);
const u128 = x => u(128, x);
const u256 = x => u(256, x);
const b0 = u(1, 0);
const b1 = u(1, 1);
const bits = x => builderOpBitString(x);
const bytes = x => builderOpCell([bits(x.toString("hex"))]);
const str = x => bytes(Buffer.from(x, "utf8"));
const addrStdFixed = (x) => {
    let parts = x.split(":");
    const wid = parts.length < 2 ? "00" : Number.parseInt(parts[0]).toString(16).padStart(2, "0");
    const addr = parts[parts.length < 2 ? 0 : 1].padStart(64, "0");
    return bits(`${wid}${addr}`);
};
const addrInt = (x) => {
    let parts = x.split(":");
    let [wid, addr] = parts.length < 2 ? ["0", parts[0]] : parts;
    wid = Number.parseInt(wid).toString(2).padStart(8, "0");
    addr = BigInt(`0x${addr}`).toString(2).padStart(256, "0");
    return bits(`n100${wid}${addr}`);
};

async function encodeDOParams(client, terms) {
    const res = (await client.boc.encode_boc({
        builder: [
            bytes(terms.model),
            bytes(terms.objective),
            u128(terms.cost),
            addrInt(terms.token),
            u128(terms.penalty),
            builderOpCell([
                addrInt(terms.validatorContract),
                u256(terms.validatorPubkey)
            ])
        ]
    })).boc;
    return res;
}

async function encodeDemand(client, demand) {
    const res = (await client.boc.encode_boc({
        builder: [
            builderOpCellBoc(await encodeDOParams(client, demand.terms)),
            demand.isDemand ? b1 : b0,
            addrInt(demand.lighthouse),
            addrInt(demand.customerAddress),
            u256(demand.customerPubkey),
            builderOpCell([
                u64(demand.nonce),
                u32(demand.deadline),
                u128(demand.validatorFee)
            ])
        ]
    })).boc;
    return res;
}

async function encodeOffer(client, offer) {
    const res = (await client.boc.encode_boc({
        builder: [
            builderOpCellBoc(await encodeDOParams(client, offer.terms)),
            offer.isDemand ? b1 : b0,
            addrInt(offer.lighthouse),
            addrInt(offer.executorAddress),
            u256(offer.executorPubkey),
            builderOpCell([
                u64(offer.nonce),
                u32(offer.deadline),
                u128(offer.providerFee)
            ])
        ]
    })).boc;
    return res;
}

async function signHash(client, hash, keys) {
    const data = Buffer.from(hash, 'hex').toString('base64')
    const signature = (await client.crypto.sign({ unsigned: data, keys: keys})).signature
    return (await client.boc.encode_boc({
        builder: [
            builderOpBitString('x' + signature)
        ]
    })).boc;
}

async function main(client) {
    const keys = JSON.parse(fs.readFileSync(keysFile, "utf8"));
    const simpleWallet = new Account(SimpleWalletContract, {signer: signerKeys(keys), client: client, initData: {nonce: 0} });
    const { root, xrt } = await constructContracts(client, keys)
    const lighthouse = new Account(LighthouseContract, { address: await getLighthouseAddress(client, root, xrt, 'Lighthouse'), client: client })

    const terms = {
      model: Buffer.from('Super model'),
      objective: Buffer.from('Very important objective'),
      cost: 3,
      token: await xrt.getAddress(),
      penalty: 3,
      validatorContract: '0',
      validatorPubkey: '0x' + keys.public
    }

    const demand = {
      terms: terms,
      isDemand: true,
      lighthouse: await lighthouse.getAddress(),
      customerAddress: await simpleWallet.getAddress(),
      customerPubkey: '0x' + keys.public,
      nonce: 0,
      deadline: 0xffffffff,
      validatorFee: 2
    }

    const offer = {
      terms: terms,
      isDemand: false,
      lighthouse: await lighthouse.getAddress(),
      executorAddress: await simpleWallet.getAddress(),
      executorPubkey: '0x' + keys.public,
      nonce: 0,
      deadline: 0xffffffff,
      providerFee: 1
    }

    const demandCell = await encodeDemand(client, demand)
    const offerCell = await encodeOffer(client, offer)
    const demandHash = Buffer.from((await client.boc.get_boc_hash({boc : demandCell})).hash, 'hex')
    const offerHash = Buffer.from((await client.boc.get_boc_hash({boc : offerCell})).hash, 'hex')

    const customerSignature = await signHash(client, demandHash, keys)
    const executorSignature = await signHash(client, offerHash, keys)

    console.log(customerSignature, executorSignature)

    message = (await client.abi.encode_message_body({
        abi: abiContract(LighthouseContract.abi),
        call_set: {
            function_name: 'createLiability',
            input: {
                demandCell : demandCell,
                customerSignature : customerSignature,
                offerCell : offerCell,
                executorSignature: executorSignature
            }
        },
        is_internal: true,
        signer: signerNone()
    }))['body'];

    const messageSubscription = await client.net.subscribe_collection({
        collection: "messages",
        filter: {
            src: { eq: await lighthouse.getAddress() },
        },
        result: "id, src, dst, msg_type, value, boc, body",
    }, async (params, responseType) => {
        if (params.result.msg_type == 2) {
          const decoded = (await client.abi.decode_message({
                    abi: abiContract(LighthouseContract.abi),
                    message: params.result.boc,
                }));
          console.log('>>> ', decoded);
        }
    });

    res = await simpleWallet.run('sendMessage', {dest : await lighthouse.getAddress(),
                                                 value: 10_000_000_000,
                                                 mode: 0,
                                                 bounce: true,
                                                 payload: message});

    /*res = await lighthouse.runLocal('createLiability', {
        demandCell : demandCell,
        customerSignature : customerSignature,
        offerCell : offerCell,
        executorSignature: executorSignature
    });
    console.log(res)*/

    const res_balance = await lighthouse.runLocal('balances', {})
    console.log(res_balance.decoded.output.balances)
    const res_stakes = await lighthouse.runLocal('stakes', {})
    console.log(res_stakes.decoded.output.stakes)
    res = await lighthouse.runLocal('currentQuota', {})
    console.log(res.decoded.output.currentQuota)
}

(async () => {
    try {
        TonClient.useBinaryLibrary(libNode);
        const client = new TonClient({
            network: {
                endpoints: config['network']['endpoints'],
            }
        });
        console.log("Hello TON!");
        await main(client);
        process.exit(0);
    } catch (error) {
        console.error(error);
    }
})();
