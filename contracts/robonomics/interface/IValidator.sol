pragma ton-solidity >= 0.42.0;

abstract contract IValidator {
    // is pubkey a valid validator
    function isValidator(uint256 pubkey) external virtual responsible functionID(17) returns (bool);
}
