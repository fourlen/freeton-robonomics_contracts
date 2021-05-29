pragma ton-solidity >= 0.42.0;

import './interface/ILiability.sol';
import './interface/ILighthouse.sol';
//import './Root.sol';
import '../ERC20/IERC20.sol';

contract Lighthouse {
    event LiabilityFinalized(uint256 liabilityHash, bool success, bytes result); // Liability termination signal
    event NewLiability(uint256 liabilityHash, uint256 demandHash, uint256 offerHash);
    event FineCharged(address provider, uint128 value); // fine charged from stake for not being online
    event CurrentProviderChanged(address provider, uint128 quota);
    event NewProvider(address provider, uint128 stake); // new provider registered
    event ProviderGone(address provider); // provider lost or withdrawn all of its stake and has gone from the queue

    uint64 private totalQueue;
    optional(uint64) private currentProvider; // not public, because ABI doesn't support optional type
                                              // software can determine the current provider by looking at last CurrentProviderChanged event
    mapping(uint64 => address) public providersQueue;
    mapping(address => uint64) public queuePos;

    uint128 public currentQuota;
    uint32 public lastAction; // unixtime of last action of the current provider

    mapping(address => uint128) public stakes; // provider stakes in quotas (1 quota = valuePerQuota tokens)

    // providers, executors and customers must refill their balance before performing any other payment
    // address holder (owner of tokens) => address token (address of ERC20 contract) => uint128 balance
    mapping(address => mapping(address => uint128)) public balances;


    // Name of this lighthouse; determines the address
    string static public name;

    LighthouseParams public lighthouseParams; // parametrs of this lighthouse

    address static public root;
    address static public xrt;

    constructor(LighthouseParams params) public functionID(1) {
      // check that we are not being deployed by a hacker
      require(msg.sender == root);

      lighthouseParams = params;

      tvm.accept();
    }

    mapping(uint256 => Liability) liabilityByHash;
    mapping(uint256 => bool) hashUsed; // unit type should be used instead of bool, but there is no such type in solidity


    modifier onlyCurrentProvider() {
        // only current provider can call this method
        require(msg.sender == providersQueue[currentProvider.get()]);
        require(now <= lastAction + lighthouseParams.timeout); // provider isn't late
        lastAction = now;

        _;
    }

    modifier returnsChange() {
        tvm.rawReserve(address(this).balance - msg.value, 0);

        _;

        msg.sender.transfer({value: 0, flag: 128});
    }


    uint64 private totalQueries;

    struct QueryInfo {
        address expected; // the address from which the response is expected
        TvmCell info; // some algebraic type, see the usage
    }
    // pending queries
    mapping(uint32 => QueryInfo) queries;

    // beacuse of the lack of msg.query_id we use unknown callback function id instead
    // and handle the answers in the fallback method
    // this is a hack, I hope they will add this field soon, so it will be possible to do this in usual way
    fallback() external {
        TvmSlice msgData = msg.data; // getting 'Unsupported lvalue' otherwise
        uint32 answer_id = msgData.decode(uint32);

        QueryInfo query = queries.at(answer_id); // will fail if answer_id is unknown
        require(query.expected == msg.sender); // we are not being fooled
        TvmSlice queryInfo = query.info.toSlice();

        delete queries[answer_id];

        // load constructor tag
        uint8 tag = queryInfo.loadUnsigned(3); // actually there is only 257- and 64- bits integers in the TVM types; so uint8 is king of irrelevant

        if (tag == 0) { // transfer attempt for refillBalance
            (address token, address holder, uint128 value) = queryInfo.decode(address, address, uint128);
            bool result = msgData.decode(bool);
            if (result)
              increaseBalance(holder, token, value);

            // return change to token holder
            tvm.rawReserve(address(this).balance - msg.value, 0);
            holder.transfer({value: 0, flag: 128});
        }
        else if (tag == 2) { // transfer attempt for withdrawnBalance
            (address token, address holder, uint128 value) = queryInfo.decode(address, address, uint128);

            // we have already decreased balance; answer must be true if the token contract is correct ERC20 contract

            // return change to token holder
            tvm.rawReserve(address(this).balance - msg.value, 0);
            holder.transfer({value: 0, flag: 128});
        }
        else {
            // do nothing
        }
    }

    function addQuery(QueryInfo queryInfo) internal returns (uint32 index) {
        totalQueries++;
        index = 1000 + uint32(totalQueries & 0x7fffffff); // mod 2^31

        require(queries.add(index, queryInfo)); // check that index isn't already used
    }

    // to fix lack of constructors of structure
    function _QueryInfo(address expected, TvmCell info) internal inline returns (QueryInfo res) {
        res.expected = expected;
        res.info = info;
    }

    function refillBalance(address token, uint128 value) external functionID(2) returnsChange {
        TvmBuilder queryInfo;
        queryInfo.storeUnsigned(0, 3); // constructor tag
        queryInfo.store(token, msg.sender, value);
        uint32 index = addQuery(_QueryInfo(token, queryInfo.toCell()));

        TvmBuilder payload;
        payload.storeUnsigned(26 /*transferFrom function id*/, 32);
        payload.storeUnsigned(index, 32); // answer_id
        payload.store(msg.sender, address(this), value); // arguments of IERC20.transferFrom
        token.transfer({value: 1 ton, bounce: true, flag: 0, body: payload.toCell()}); // send message
        // change of the 1 ton will be returned in responce message and then we will return the rest to the original msg.sender

        // if the result is positive, we will increase user's balance in fallback function
    }

    function withdrawBalance(address token, uint128 value) external functionID(3) returnsChange {
        TvmBuilder queryInfo;
        queryInfo.storeUnsigned(2, 3); // constructor tag
        queryInfo.store(token, msg.sender, value);
        uint32 index = addQuery(_QueryInfo(token, queryInfo.toCell()));

        TvmBuilder payload;
        payload.storeUnsigned(12 /*transfer function id*/, 32);
        payload.storeUnsigned(index, 32); // answer_id
        payload.store(msg.sender, value); // arguments of IERC20.transfer
        token.transfer({value: 1 ton, bounce: true, flag: 0, body: payload.toCell()}); // send message

        // the tranfer attempt must be successful, if the contract is correct ERC20 contract
        decreaseBalance(msg.sender, token, value);
        // we use response only for returning the change of 1 ton message value
    }

    function increaseBalance(address holder, address token, uint128 value) internal inline {
        balances[holder][token] += value;
    }

    function decreaseBalance(address holder, address token, uint128 value) internal {
        uint128 oldValue = balances[holder][token];
        if (oldValue == value)
            delete balances[holder][token];
        else
            balances[holder][token] = oldValue - value;
    }

    function transferBalance(address from, address to, address token, uint128 value) internal inline {
        decreaseBalance(from, token, value);
        increaseBalance(to, token, value);
    }

    function getLiabilityHash(uint256 demandHash, uint256 offerHash) internal inline returns (uint256 liabilityHash) {
        TvmBuilder builder;
        builder.store(demandHash, offerHash);
        liabilityHash = tvm.hash(builder.toCell());
    }

    function checkDemandOffer(DemandParams demand, OfferParams offer) internal inline {
        // == for structures is not supported yet
        // we deal with it in createLiability by comparing hashes
        // require(demand.terms == offer.terms);

        require(now < demand.deadline);
        require(now < offer.deadline);

        // check that the provider hasn't switched demmand and offer cells
        require(demand.isDemand);
        require(!offer.isDemand);

        require(demand.lighthouse == offer.lighthouse);
        require(demand.lighthouse == address(this));
    }

    function createLiability(
        TvmCell demandCell, TvmCell customerSignature,
        TvmCell offerCell, TvmCell executorSignature
    )
        external functionID(4)
        returnsChange
        onlyCurrentProvider
    {
        // decode data from cells
        DemandParams demand = DOParamsCoding.decodeDemandParams(demandCell.toSlice());
        OfferParams offer = DOParamsCoding.decodeOfferParams(offerCell.toSlice());

        // check the signatures
        uint256 demandHash = tvm.hash(demandCell);
        uint256 offerHash  = tvm.hash(offerCell);

        require(tvm.checkSign(demandHash, customerSignature.toSlice(), demand.customerPubkey));
        require(tvm.checkSign(offerHash, executorSignature.toSlice(), offer.executorPubkey));

        // validate the match
        checkDemandOffer(demand, offer);
        // instead of require(demand.terms == offer.terms);
        require(tvm.hash(demandCell.toSlice().loadRef()) == tvm.hash(offerCell.toSlice().loadRef()));


        // construct structure to store in persistent data
        Liability liability;
        liability.terms = demand.terms; // ( = offer.terms)
        liability.customerPubkey = demand.customerPubkey;
        liability.executorPubkey = offer.executorPubkey;
        liability.customerAddress = demand.customerAddress;
        liability.executorAddress = offer.executorAddress;
        liability.validatorFee = demand.validatorFee;

        // actually we take into account all the data from demand and offer, not only that is needed to be stored
        uint256 liabilityHash = getLiabilityHash(demandHash, offerHash);

        liabilityByHash[liabilityHash] = liability;

        // reply-protection
        require(!hashUsed[demandHash]);
        require(!hashUsed[offerHash]);
        hashUsed[demandHash] = true;
        hashUsed[offerHash] = true;
        // Fees charging
        transferBalance(liability.customerAddress, address(this), xrt, liability.validatorFee);
        transferBalance(liability.customerAddress, address(this), liability.terms.token, liability.terms.cost);
        transferBalance(liability.executorAddress, address(this), liability.terms.token, liability.terms.penalty);
        transferBalance(liability.executorAddress, msg.sender, xrt, offer.providerFee);

        emit NewLiability(liabilityHash, demandHash, offerHash);

        consumeQuota();
    }

    function _finalizeLiability(bytes result, uint256 liabilityHash, bool success, address validatorPaymentAddress) internal {
        Liability liability = liabilityByHash[liabilityHash];

        if (success)
            transferBalance(address(this), liability.executorAddress, liability.terms.token, liability.terms.cost + liability.terms.penalty);
        else
            transferBalance(address(this), liability.customerAddress, liability.terms.token, liability.terms.cost + liability.terms.penalty);

        transferBalance(address(this), validatorPaymentAddress, xrt, liability.validatorFee);

        delete liabilityByHash[liabilityHash];
        emit LiabilityFinalized(liabilityHash, success, result);
    }

    // called by on-chain validator contract
    function finalizeLiability_validatorContarct(
        bytes result,
        uint256 liabilityHash,
        bool success
    )
        external functionID(11)
        responsible returns (bool)
    {
        Liability liability = liabilityByHash[liabilityHash];
        DOParams terms = liability.terms; // it probably will cost less gas

        // because of TonLabs ABI mixture of methods called by external or internal messages
        // msg.sender can be equal to zero
        require(terms.validatorContract != address(0));
        require(terms.validatorContract == msg.sender);

        _finalizeLiability(result, liabilityHash, success, msg.sender);

        // return change
        tvm.rawReserve(address(this).balance - msg.value, 0);
        return{value: 0, flag: 128} true;
    }

    // called by provider when validator is external
    function finalizeLiability(
        TvmCell dataCell,
        TvmCell signature
    )
        external functionID(5)
        returnsChange
        onlyCurrentProvider
    {
        TvmSlice data = dataCell.toSlice();
        (bytes result, uint256 liabilityHash, bool success) = data.decode(bytes, uint256, bool);
        address validatorPaymentAddress = data.decode(address); // address for paying validator fee
                                                                // signed with current validator (possibly the executor)

        Liability liability = liabilityByHash[liabilityHash];
        DOParams terms = liability.terms; // it probably will cost less gas

        // validator is external
        require(terms.validatorContract == address(0));

        // check the signature
        if (terms.validatorPubkey > 0)
            require(tvm.checkSign(tvm.hash(dataCell), signature.toSlice(), terms.validatorPubkey));
        else
            require(tvm.checkSign(tvm.hash(dataCell), signature.toSlice(), liability.executorPubkey));

        _finalizeLiability(result, liabilityHash, success, validatorPaymentAddress);

        consumeQuota();
    }

    // providers can call this method to reset timeout timer and consume one quota
    // it is useful in the case there is no matching demmand-offer pairs
    function no_liabilities() external functionID(6)
        returnsChange
        onlyCurrentProvider
    {
        consumeQuota();
    }

    function queuePush(address providerAddress) internal returns (uint64) {
        uint64 index = totalQueue++;
        providersQueue[index] = providerAddress;
        queuePos[providerAddress] = index;

        if (!currentProvider.hasValue()) {
            currentProvider = index;
            currentQuota = stakes[providerAddress];
            emit CurrentProviderChanged(providerAddress, currentQuota);
            lastAction = now;
        }

        return index;
    }

    // changes current provider to the next one
    function moveMarker() internal {
        optional(uint64, address) res = providersQueue.next(currentProvider.get());

        if (res.hasValue()) {
            address providerAddress;
            (currentProvider, providerAddress) = res.get();
            currentQuota = stakes[providerAddress];
            emit CurrentProviderChanged(providerAddress, currentQuota);
            lastAction = now;
        }
        else
            currentProvider.reset();
    }

    function quotaConsumed() internal {
        address providerAddress = providersQueue[currentProvider.get()];
        delete providersQueue[currentProvider.get()];
        queuePush(providerAddress);
        moveMarker();
    }

    function consumeQuota() internal {
        currentQuota -= 1;
        if (currentQuota == 0) {
            quotaConsumed();
        }
    }

    function deleteProvider(address providerAddress) internal {
        if (providerAddress == providersQueue[currentProvider.get()]) {
            moveMarker();
        }

        emit ProviderGone(providerAddress);

        delete stakes[providerAddress];
        delete providersQueue[queuePos[providerAddress]];
        delete queuePos[providerAddress];
    }

    function decreaseStake(address providerAddress, uint128 value) internal {
        stakes[providerAddress] -= value;

        if (stakes[providerAddress] == 0) {
            deleteProvider(providerAddress);
        }
        else if (providersQueue[currentProvider.get()] == providerAddress) {
            currentQuota -= math.min(currentQuota, value);
            if (currentQuota == 0) {
                quotaConsumed();
            }
        }

    }

    function chargeFine(address providerAddress, uint128 value) internal {
        uint128 actualValue = math.min(stakes[providerAddress], value);
        decreaseStake(providerAddress, actualValue);
        emit FineCharged(providerAddress, actualValue);
    }

    function checkTimeout() external functionID(7) returnsChange {
        if (lastAction + lighthouseParams.timeout < now) {
            uint32 periods = (now - lastAction) / lighthouseParams.timeout;
            lastAction += lighthouseParams.timeout * periods;

            chargeFine(providersQueue[currentProvider.get()], periods);
        }
    }

    // register msg.sender as a new provider
    function registerProvider(uint128 stake) external functionID(8) returnsChange {
        require(!stakes.exists(msg.sender)); // msg.sender isn't a provider yet

        require(stake > 0);
        decreaseBalance(msg.sender, xrt, stake * lighthouseParams.valuePerQuota);

        stakes[msg.sender] = stake;

        emit NewProvider(msg.sender, stake);

        queuePush(msg.sender);
    }

    // moves provider to the end of the queue; equivalent to withdrawning stake to zero and registering a new provider
    function refillStake(uint128 stake) external functionID(9) returnsChange {
        require(stakes.exists(msg.sender)); // msg.sender is indeed a provider

        decreaseBalance(msg.sender, xrt, stake * lighthouseParams.valuePerQuota);

        stakes[msg.sender] += stake;
        if (providersQueue[currentProvider.get()] == msg.sender) {
            quotaConsumed();
        }
        else {
            delete providersQueue[queuePos[msg.sender]];
            queuePush(msg.sender);
        }
    }

    function withdrawStake(uint128 stake) external functionID(10) returnsChange {
        require(stakes.exists(msg.sender)); // msg.sender is indeed a provider

        increaseBalance(msg.sender, xrt, stake * lighthouseParams.valuePerQuota);
        decreaseStake(msg.sender, stake);
    }
}
