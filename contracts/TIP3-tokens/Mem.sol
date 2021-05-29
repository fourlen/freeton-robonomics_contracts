pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;

interface IRootTokenContract {
    function mint(uint128 tokens) external functionID(0xf);
}

contract Mem {
    address public rootToken;
    uint256 public kek = 1;
    constructor(address rootToken_) public {
        //require(tvm.pubkey() != 0, 101);
        //require(msg.pubkey() == tvm.pubkey(), 102);
        tvm.accept();
        rootToken = rootToken_;
    }

    function mint(uint128 value) external {
        tvm.accept();
        IRootTokenContract(rootToken).mint(value);
    }
}
