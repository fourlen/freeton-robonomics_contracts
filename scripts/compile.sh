#!/bin/bash

contracts=("Root" "Lighthouse" "XRT")

for contract in "${contracts[@]}"
do
    rm -f ../artifacts/$contract.abi.json
    rm -f ../artifacts/$contract.tvc
    rm -f ../artifacts/"$contract"Contract.js

    echo npx tondev sol compile ../contracts/robonomics/$contract.sol
    npx tondev sol compile ../contracts/robonomics/$contract.sol &> /dev/null
    npx tondev js wrap ../contracts/robonomics/$contract.abi.json
    mv ../contracts/robonomics/$contract.abi.json ../artifacts
    mv ../contracts/robonomics/$contract.tvc ../artifacts
    mv ../contracts/robonomics/"$contract"Contract.js ../artifacts
done
