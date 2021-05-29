pragma ton-solidity >=0.42.0;

import '../ERC20/ERC20.sol';

contract XRT is ERC20 {
    address static public root;

    modifier returnsChange() {
        tvm.rawReserve(address(this).balance - msg.value, 0);
        _;
        msg.sender.transfer({value: 0, flag: 128});
    }

    function decimals() public view override responsible returns (uint8) {
        return 9;
    }

    constructor() public {
        tvm.accept();
    }

    function mint(address to, uint128 amount) external returnsChange {
        require(msg.sender == root);
        _mint(to, amount);
    }
}
