Use compile.sh script to compile Root.sol, XRT.sol and Lighthouse.sol and move all the artifacts to the corresponding folder.

To redeploy the contracts after making some changes and recompiling them run newKeys.js for generating new keys (they also serve as nonce for contract addresses, so the new project version won't conflict with older versions which has been already deployed), then run deployContracts.js (for the first deploy it also works fine).
All the scripts read some config params from the config.js (e.g. which network to use), check it out.
Also deploying new contracts requires transfering some balance first, it is done requesting a giver to transfer this value -- see giverConfig.js, which exports one function get_tokens_from_giver. The present giver config contains default TON OS SE giver params -- when deploying in other network, you may want to deploy your own giver first or to use another logic in get_tokens_from_giver.

For testing purposes you can create a few simple wallets with createSimpleWallets.js. They can be used for sending designated internal messages to other contracts. Also if the network type specified in config is 'test', deployContracts.js mints some XRTs to the simple wallets.

Scripts in the tests folder is rather manual tests (nevertheless they have some asserts), you can use them to interact with the contracts by created simple wallets.

First of all, create a lighthouse with createLighthouse.js script. You can set lighthouse parametrs and give another name, by which lighthouse is identified.
Also this script lists all the existing lighthouses and checks that expected addresses are equal to actual ones.

You can refillBalance.js and withdrawBalance.js transfering some XRTs owned by a simple wallet to lighthouse contract (by default one with name 'Lighthouse' is used). You can choice the simple wallet to use changing the nonce field in its constructor params.
This and other script listen to events emited by the contracts and display them.

After that you may want to register one or several providers with registerProvider.js (also using simple wallets).

Registered a provider, you may consume one quota with no_liabilities.js, refill or withdraw stake, create and then finalize liability with the corresponding scripts. Also you may wait for the timeout and check charging fines mechanism with checkTimeout.js, or test on-chain validator finalization (you have to edit createLiability script for this).

By now you have to manually copy the liability hash printed by createLiability and paste it in finalizeLiability script.
