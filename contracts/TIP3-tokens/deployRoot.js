const { abiContract, TonClient } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");

const fs = require('fs');
const path = require('path');
const keysFile = path.join(__dirname, 'keys.json');

const config = require('./config');

const {RootTokenContractContract} = require('./RootTokenContractContract.js');
const {TONTokenWalletContract} = require('./TONTokenWalletContract.js');

async function main(client) {
    const keys = JSON.parse(fs.readFileSync(keysFile, 'utf8'));

    const abi = {
        type: 'Contract',
        value: RootTokenContractContract.abi
    }

    const deployOptions = {
        abi,
        deploy_set: {
            tvc: RootTokenContractContract.tvc,
            initial_data: {}
        },
        call_set: {
            function_name: 'constructor',
            input: {
                name: "526f626f6e6f6d6963732e4e6574776f726b", // Robonomics.network
                symbol: "585254", //XRT
                decimals: 9,
                root_public_key: 0,
                root_owner: "0x4aa02e54ca4dabc89b3ca92fb7f264a3b721fa1fab53fa5bac49b7293dae688b",
                wallet_code: TONTokenWalletContract.code,
                total_supply: config['initialSupply']
            }
        },
        signer: {
            type: 'Keys',
            keys: keys
        }
    }

    const { address } = await client.abi.encode_message(deployOptions);
    console.log(`Future address of the contract will be: ${address}`);

    await client.processing.process_message({
        send_events: false,
        message_encode_params: deployOptions
    });

    console.log(`Hello contract was deployed at address: ${address}`);
}

(async () => {
    try {
        // Link the platform-dependable TON-SDK binary with the target Application in Typescript
        // This is a Node.js project, so we link the application with `libNode` binary
        // from `@tonclient/lib-node` package
        // If you want to use this code on other platforms, such as Web or React-Native,
        // use  `@tonclient/lib-web` and `@tonclient/lib-react-native` packages accordingly
        // (see README in  https://github.com/tonlabs/ton-client-js )
        TonClient.useBinaryLibrary(libNode);
        const client = new TonClient({
            network: {
                endpoints: ["http://195.161.41.59"],
            }
        });
        console.log("Hello localhost TON!");
        await main(client);
        process.exit(0);
    } catch (error) {
        console.error(error);
    }
})();
