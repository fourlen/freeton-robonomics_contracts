pragma ton-solidity >= 0.42.0;
interface ITONTokenWallet {
    constructor(bytes name, bytes symbol, uint8 decimals, uint256 root_public_key, uint256 wallet_public_key, address root_address, TvmCell code) external;
    function transfer(address dest, uint128 tokens, uint128 grams) external;
    function getBalance_InternalOwner(uint32 _answer_id) external returns (uint128 value0);
    function accept(uint128 tokens) external;
    function internalTransfer(uint128 tokens, uint256 pubkey, uint256 my_owner_addr) external;
    function destroy(address dest) external;
    function getName() external returns (bytes value0);
    function getSymbol() external returns (bytes value0);
    function getDecimals() external returns (uint8 value0);
    function getBalance() external returns (uint128 value0);
    function getWalletKey() external returns (uint256 value0);
    function getRootAddress() external returns (address value0);
    function getOwnerAddress() external returns (address value0);
    function allowance() external returns (address spender, uint128 remainingTokens);
    function approve(address spender, uint128 remainingTokens, uint128 tokens) external;
    function transferFrom(address dest, address to, uint128 tokens, uint128 grams) external;
    function internalTransferFrom(address to, uint128 tokens) external;
    function disapprove() external;
}
