pragma ton-solidity >= 0.42.0;
interface IRootTokenContract {
    constructor(bytes name, bytes symbol, uint8 decimals, uint256 root_public_key, uint256 root_owner, TvmCell wallet_code, uint128 total_supply) external;
    function deployWallet(uint32 _answer_id, int8 workchain_id, uint256 pubkey, uint256 internal_owner, uint128 tokens, uint128 grams) external returns (address value0);
    function deployEmptyWallet(uint32 _answer_id, int8 workchain_id, uint256 pubkey, uint256 internal_owner, uint128 grams) external returns (address value0);
    function grant(address dest, uint128 tokens, uint128 grams) external;
    function mint(uint128 tokens) external;
    function getName() external returns (bytes value0);
    function getSymbol() external returns (bytes value0);
    function getDecimals() external returns (uint8 value0);
    function getRootKey() external returns (uint256 value0);
    function getTotalSupply() external returns (uint128 value0);
    function getTotalGranted() external returns (uint128 value0);
    function getWalletCode() external returns (TvmCell value0);
    function getWalletAddress(int8 workchain_id, uint256 pubkey, uint256 owner_std_addr) external returns (address value0);
    function getWalletCodeHash() external returns (uint256 value0);
}
