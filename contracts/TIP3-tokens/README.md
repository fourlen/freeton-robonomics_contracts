Prere

Find out the future (raw) address of Mem contract with command "tonos-cli genaddr Mem.tvc Mem.abi.json --setkey keys.json"
Then paste it to root_owner field in deployRoot.js code without specifying wc.
You should transfer some founds to the future contract addresses before deploying.
The address of RootTokenContract can be found with the same command "tonos-cli genaddr RootTokenContract.tvc RootTokenContract.abi.json --setkey keys.json".
After transferring founds deploy RootTokenContract with command "node deployRoot.js"
Then deploy Mem contract with command "tonos-cli deploy Mem.tvc '{"rootToken_" : "<address of RootTokenContract>"}' --abi Mem.abi.json --sign keys.json"

Now you can run get-methods of RootTokenContract with commands:
tonos-cli run <root_address> getName {} --abi RootTokenContract.abi.json
tonos-cli run <root_address> getSymbol {} --abi RootTokenContract.abi.json
tonos-cli run <root_address> getDecimals {} --abi RootTokenContract.abi.json
tonos-cli run <root_address> getRootKey {} --abi RootTokenContract.abi.json
tonos-cli run <root_address> getTotalSupply {} --abi RootTokenContract.abi.json
tonos-cli run <root_address> getWalletCode {} --abi RootTokenContract.abi.json

And you can mint some new tokens with the command:
tonos-cli call <Mem_address> mint '{"value":"<Tokens number>"}' --sign keys.json --abi Mem.abi.json

Check the totalSupply with the get-method after this.
