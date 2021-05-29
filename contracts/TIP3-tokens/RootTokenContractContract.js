const RootTokenContractContract = {
    abi: {
        "ABI version": 2,
        "header": [
            "pubkey",
            "time",
            "expire"
        ],
        "functions": [
            {
                "name": "constructor",
                "inputs": [
                    {
                        "name": "name",
                        "type": "bytes"
                    },
                    {
                        "name": "symbol",
                        "type": "bytes"
                    },
                    {
                        "name": "decimals",
                        "type": "uint8"
                    },
                    {
                        "name": "root_public_key",
                        "type": "uint256"
                    },
                    {
                        "name": "root_owner",
                        "type": "uint256"
                    },
                    {
                        "name": "wallet_code",
                        "type": "cell"
                    },
                    {
                        "name": "total_supply",
                        "type": "uint128"
                    }
                ],
                "outputs": [],
                "id": "0xb"
            },
            {
                "name": "deployWallet",
                "inputs": [
                    {
                        "name": "_answer_id",
                        "type": "uint32"
                    },
                    {
                        "name": "workchain_id",
                        "type": "int8"
                    },
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    },
                    {
                        "name": "internal_owner",
                        "type": "uint256"
                    },
                    {
                        "name": "tokens",
                        "type": "uint128"
                    },
                    {
                        "name": "grams",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ],
                "id": "0xc"
            },
            {
                "name": "deployEmptyWallet",
                "inputs": [
                    {
                        "name": "_answer_id",
                        "type": "uint32"
                    },
                    {
                        "name": "workchain_id",
                        "type": "int8"
                    },
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    },
                    {
                        "name": "internal_owner",
                        "type": "uint256"
                    },
                    {
                        "name": "grams",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ],
                "id": "0xd"
            },
            {
                "name": "grant",
                "inputs": [
                    {
                        "name": "dest",
                        "type": "address"
                    },
                    {
                        "name": "tokens",
                        "type": "uint128"
                    },
                    {
                        "name": "grams",
                        "type": "uint128"
                    }
                ],
                "outputs": [],
                "id": "0xe"
            },
            {
                "name": "mint",
                "inputs": [
                    {
                        "name": "tokens",
                        "type": "uint128"
                    }
                ],
                "outputs": [],
                "id": "0xf"
            },
            {
                "name": "getName",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "bytes"
                    }
                ],
                "id": "0x10"
            },
            {
                "name": "getSymbol",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "bytes"
                    }
                ],
                "id": "0x11"
            },
            {
                "name": "getDecimals",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "uint8"
                    }
                ],
                "id": "0x12"
            },
            {
                "name": "getRootKey",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "uint256"
                    }
                ],
                "id": "0x13"
            },
            {
                "name": "getTotalSupply",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "uint128"
                    }
                ],
                "id": "0x14"
            },
            {
                "name": "getTotalGranted",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "uint128"
                    }
                ],
                "id": "0x15"
            },
            {
                "name": "getWalletCode",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "cell"
                    }
                ],
                "id": "0x16"
            },
            {
                "name": "getWalletAddress",
                "inputs": [
                    {
                        "name": "workchain_id",
                        "type": "int8"
                    },
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    },
                    {
                        "name": "owner_std_addr",
                        "type": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ],
                "id": "0x17"
            },
            {
                "name": "getWalletCodeHash",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "uint256"
                    }
                ],
                "id": "0x18"
            }
        ],
        "events": []
    },
    tvc: "te6ccgECUQEAF9IAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAij/ACDBAfSkIFiS9KDgXwKKIO1T2RMEAQr0pCD0oQUCA89ADQYCASAJBwGdCDXS45D7UAD038g10uBAIAiAbmOFF8D03/RBO1QMTFVAjBVAjBVAjABIFkBVQHhcRK68uBDAcAA8uBCAdUicFURAVURAVUD2YEDpyMBvIAgAqo5JIsEsjiMwA/pAINdLgQCAIgG5J+FxuvLgQ8AA8uBC1SVwVREBVREB2SBZAVUB4XETuvLgQwLAAPLgQgLVI3BVEQFVAVUTAVUE2eED+kAkcHBVAdkBkwg10vtQI4bW9N/0QjtUFUDMFUDMFUDMFUEMFUEMFUEMFUDgQMHJAG8joDhBNIH0//T/9N/KHBfQFUbVQVVDFUNVRZVSVUbVQ3ZgCgGSjiJb038g10uBAIAiAbkq4XG68uBDwADy4ELVKHBVEQFVEQHZgQKHJQG8joDhBdIH0//T/yhwXzBVGlUEVRpVDFUHVTlVGlUM2QsBio4iW9P/INdLgQCAIgG5KOFxuvLgQ8AA8uBC1SZwVREBVREB2YECByYBvI6A4QbSB9P/KHBfIFUZVQNVKFULVSlVGVUL2QwB/o4iW9P/INdLgQEAIgG5JuFxuvLgQ8AA8uBC1SRwVREBVREB2YEBBycBvI5KJsIHjiMwB9IHINdLgQEAIgG5K+FxuvLgQ8AA8uBC1SlwVREBVREB2SBZAVUB4HEXuvLgQwbAAPLgQgbVJXBVEQFVAVUjVSZVCNnhB9IHKHBwVQFFAcVSDXS4EChyIBvCHCA+1AjiRb03/RC+1QVQUwVQUwVQUwVQUwVQYwVQYwVQYwVQYwVQYwVQVRMrCOgOEF1NTTB9P/0//UKHBfYHKAEWNygBFjAVUJgBNhVTdVbHKAEWOAE2HZgOAZSBAgclAbyOIdQg10uBAIAiAblWEOFxuvLgQ8AA8uBC1S5wVREBVREB2VIUsI6A4TAF1NTTB9P/0/8mcF9AVR1VBVUdVQ9VNVVp2Q8BhCTCAo4YW9P/INdLIMAA8tBDcboBwACwLOHVMSvZUSGwjoDhMAbU1NMH0/8qcF9QVR5VBlUtgBFhVShVTFUegBFh2RABloEBBycBvI4iW9P/INdLgQEAIgG5K+FxuvLgQ8AA8uBC1SlwVREBVREB2VESsI6A4QjU1NMHK3BfMFUdVQpVO1UZAVUKVTtVHVUP2REBjifCB44iW9MHINdLgQEAIgG5KOFxuvLgQ8AA8uBC1SZwVREBVREB2VETsI6A4QnU1CtwXyBVHFUJVTpVCFUNVQ5VLFUcVQ7ZEgD+jh3UINdLIcEIJuFxuvLgQ8AA8uBC1SRwVREBVREB2Y5XjidxGroKwABQCrAocHBVBVUBVTZVBVUYVRpVGuEL1TErAVWRVQtVC9mOGDAK1CDXSyDAAPLQQ3G6AcAAsCzh1TEr2SrBApcqwAIhVQLi4SrAAPLQQwHZJAHhCtQr2QIBIDcUAgL9NRUCASA2FgE1NMAjoACwACZcHAjAVURVQLZ4IECANcYcSPZgFwEwIdMAjoACwACZcHAjVREBVRHZ4NP/cSPZGASibe1ABsMAA9M/0x/TH5UB7VDbMCLBEo6A4SLBD46A4SLBDI6A4QLAC/KpBvKoBPLgRF8DBfkBQGD5EMAA8mjtRNDTADDAAPJ++ABw+GQwAvABJyIaGQHejmfIcCEBzwsAcCEBzws/HcwbzBnLB+1HCM8L/wdvEFBHy39wzwt/FMwFbxdvEI4bMBj6AslQBMzJ7VSACzExMTExMVUCMFUCMAHZJyHgcRnPCwATzidwVREBVQlVJVUIVQZVCFUJVQnZJMAAJMAAOwKWIsEOjoDhAsAM8qkG8qgE8uBEMAf5AVQQhPkQwADyaO1E0NMAAcAA8r/TP9TU0wfT/9N/03/U1dMAjoACwACWcCJwVSDZ4PpAcSPZHxsB2CxWE74NwwBQDbAB+gAwAfJ8+COBA+iogggbd0CgVhIBuSDyvHD4ZA7TH/ACgBFhwADy4GhWE1UNuvLgZFIcoFPAufLQZY6AI8AA+ACdcHBVBDAiVQJVE1Ui2eDIdM8LAiYBygcUy//J0HEk2RwBpnCAFGGAGGFVAeMEyHAhAc8LAHAhAc8LP/goI85WFlUBzFYVAcxWFAHLB3DPC39WGAHL/xrL/46AkyIh2SYB4XEkAc8LABfOJnBVBgFVM1UHVRbZHQH8VhIBzFPDygfJAczJcCUBzwsBDMwLyYAOJQHPCx8ay390Fc8LAnQkAc8LAgrQgB9h0A3JDdMBUCzOUOLKB3EVzwsBBckNwAJQw8zJVhJVBMxxzwsAzHDPCwDJIPkAFM8L/8nQUgvOgBJh+gKAGmEB9ABw+gJw+gJzzwthE8xxHgDmzwsAGszJc/sAyAnysHMpAc8LAXAqAc8LAcnQAc4G+kAwUAbOgAyADBrPCx8YznEYzwthB8lQB8zJcPsAyHDPCwBRZss/UGn6AlUPVQjMH8wdywcfy/8ay38dy38XzAnJUAnMye1UXwdVATBVATBVAjAB2QGAB/KoBfLgRFsH+QFUEIT5EMAA8mjtRNDTAAHAAPK/0z/U1NMH0//Tf9N/1NXTAI6AAsAAlnAicFUg2eD6QHEj2SAB/ixWE74NwwBQDbAB+gAwAfJ8+COBA+iogggbd0CgVhIBuXAhgBRhVQHjBAHyvHD4ZAzAAA3wAw/y4GhWEFUJuvLgZFIIoFOAufLQZfgAyHYhAc8LA3AiAc8LAcnQAc6ADoAOE88LHxrLf1A5zgjJUI76AoASYQH0AHD6AnD6AnEhAH7PC2EdzMlz+wDIcM8LAFG7yz9Qu/oCUJrMF8wVywcay/8Sy3/LfxfMA8lQA8zJ7VRbVQEwVQEwVQIwVQIwAdkCjCLBEI6A4QfyqAXy4ERbB/kBVBCE+RDAAPJo7UTQ0wABwADyv9M/1NTTB9P/03/Tf9TV0wCOgALAAJZwInBVINng+kBxI9klIwFsLFYTvg3DAFANsAH6ADAB8nz4I4ED6KiCCBt3QKBWEgG5cCGAFGFVAeMEAfK8cPhkLddLIcJ/JADkjk9fAw3Tf9EMwADy4GhS6Lry4GT4AMhwzwsAUczLPxrMULb6AslQlKBQZMwUywcZy//Lf8t/zBXMye1UgA8xMVUBMFUBMFUCMFUCMFUCMAHZIFkBVQHgcRK68uBDAcAA8uBCDtUvcFUBVdJVHgGAEWHZAf4CwRGOce1E0NMAAcAA8r9w+GQO0NMBAcACyAHysHMhAc8LAXAiAc8LAcnQAc4C+kAwUALOgBFxEs8LYYARE88LH1UP0z/U1DBQA8zJUATMyXD7ADAxMVUBMFUBMFUBMFUBMFUBMFUBMFUBMFUCMFUCMFUCMAHZ4e1E0NMAAcAAJgDO8r9w+GQO0NMBAcACyAHysHMhAc8LAXAiAc8LAcnQAc4C+kAwUALOgBBxEs8LYYAQE88LH1UP0z/UMFACzMlQA8zJcPsAMTFVATBVATBVATBVATBVATBVATBVATBVAjBVAjBVAjAB2QP8IsEVjoDhIsETjoDh7UTQ0wABwADyv3D4ZA/Q0wEBwALIAfKwcyEBzwsBcCIBzwsBydABzgL6QDBQAs6AEnESzwthgBITzwsfgBFh0z/U1NMHMFAEywfJUAXMyXD7AFsxVQEwVQEwVQEwVQEwVQEwVQEwVQEwVQEwVQEwVQIwKykoABBVAjBVAjAB2QH+AsEUjnntRNDTAAHAAPK/cPhkDtDTAQHAAsgB8rBzIQHPCwFwIgHPCwHJ0AHOAvpAMFACzoAUcRLPC2GAFBPPCx9VD9M/1NTTB9P/038wUAbLf8lQB8zJcPsAXwQxMVUBMFUBMFUBMFUBMFUBMFUBMFUBMFUCMFUCMFUCMAHZ4SoA7u1E0NMAAcAA8r9w+GQO0NMBAcACyAHysHMhAc8LAXAiAc8LAcnQAc4C+kAwUALOgBNxEs8LYYATE88LH1UP0z/U1NMH0/8wUAXL/8lQBszJcPsAXwMxMVUBMFUBMFUBMFUBMFUBMFUBMFUBMFUCMFUCMFUCMAHZA/wiwReOgOECwRaOgOHtRNDTAAHAAPK/cPhkDtDTAQHAAsgB8rBzIQHPCwFwIgHPCwHJ0AHOAvpAMFACzg/TP4AVcYASYQHPC2GAFRXPCx8C1NTTB9P/03/TfzBQB8t/yVAIzMlw+wBfAzExMTFVATBVATBVATBVATBVATBVATAvLSwAHFUBMFUCMFUCMFUCMAHZAf7tRNDTAAHAAPK/cPhkDtDTAQHAAsgB8rBzIQHPCwFwIgHPCwHJ0AHOAvpAMFACzg/TP9SAFnGAE2EBzwthgBYWzwsfAtTTB9P/03/Tf9QwUAfMyVAJzMlw+wBfAzExMTExVQEwVQEwVQEwVQEwVQEwVQEwVQEwVQIwVQIwVQIwLgAEAdkCsiLBGI6A4e1E0NMAAcAA8r8C0gfT/9P/MATTP9TU0wdwAdP/cPhkjoArwAAC03/Tf9SOEXAkVQFVaFUPVUpVDlUPVQ/ZMSUB4Mh0zwsCLQHKBx/L/8nQcSTZMzABjshwIQHPCwBwIQHPCz/4KCPOUO7MHMwaywdwzwt/F8v/HMv/joCTKSHZJwHhcSkBzwsAHc4scFUMVQlVKlVIVQlVDFUNVRzZMQH+gB1h0NMBAcAC8rBWEVUBzFP7ygfJAcxzKwHPCwFwLAHPCwHJ0AHOAclQDcwB+kAwAckMznQqAc8LAoAXcRPPC2GAFxzPCx8BVQ/PCgdxHc8LAVDUzMlVD1UDzHHPCwDMcM8LAMn5ABrPC//J0FAKzslQB8zJcPsAXwYxMTFVATIAQjBVATBVATBVATBVATBVATBVATBVATBVAjBVAjBVAjAB2QH8AsAY8qntRNDTAAHAAPK/cPhkDtDTAQHAAsgB8rBzIQHPCwFwIgHPCwHJ0AHOAvpAMFACzg/TP9TUgBhxgBRhAc8LYYAYF88LHwLTB9P/03/Tf9Qw+QAWzwv/yVAJzMlw+wBbMTExMTExVQEwVQEwVQEwVQEwVQEwVQEwVQEwNAAWVQIwVQIwVQIwAdkCASA2NgAFPI2gAp7fAdDTAAHAAPKwINYB0wCW7UDtUNswAsAAjoDgMAPSHwHA//gA8uBm0x8BwA7y4GbtRNDTAAHAAALTfzAC8r/TP9TU0wfT/9N/03/U1dMAOTgA8I5jU225AvoAMALy0GfIcCEBzwsAUe7LPx3MG8wZywdQXKFQa8v/B8AAUEfLfxnLfxjMjhYwUGP6AslQAszJ7VRwMTExMTExMQHZJSHgcRfPCwAYziVwVQdVQl4wVQVVCFUIVQjZAsAAmXBwIwFVEVUC2eD6QHEj2QPMMCPXDR9vo8AAnnAxMVUBMFUBMFUBMAHZ4DAk10nAAPJwwACccFUBMFUBMFUBMAHZ4G0E0x+ecDExVQEwVQEwVQEwAdkiwQ2OgOEiwQyOgOECwAsi4e1E0NMAMMAA8n74AHD4ZPABQTw6AeaOa8hwIQHPCwBwIQHPCz8dzBvMGcsH7UcIzwv/B28QUEfLf3DPC38UzAVvF28Qjh8wGPoCyVAEzMntVIALMTExMTExMVUBMFUBMFUBMAHZJyHgcRnPCwATzidwVREBVQlVJVUIVQZVCFUJVQnZJMAAJMAAOwCejkPy0Gr4KNMBIcEDmDDAA/LQY/I04QHAAvK00wABwACOFch0zwsCAtIHMFACygcWy//J0HAj2SBZAVUB4AH6BDEhVQHZIgHg8uBqcHEj2QFe7UTQ0wABwADyv9M/1NTTB9P/03/Tf9TV0wCOgALAAJlwcSNVEQFVEdng+kBwI9k9AfhwcPhkAvoAMA/TH/ACBvLQaYAXYdMA0wDTAPpAU8HHBcAAAfpA+gAwAvLQZDAlgBFhoFYRIbny0GXtR28QbxeOgCnAAPgAAm8QFKJWGiG5AVYb4wRy+wKOEXAiVQhVOVUGVVdVDFUNVQ3Z4Mh0zwsCKgHKBxjL/8nQcSLZPgGQyHAhAc8LAHAhAc8LP/goI85WGlUBzFYZAcxWGAHLB3DPC39WFwHL/x3L/46AkyIh2SUB4XEkAc8LABbOJXBVBQFVI1UGVRXZPwH+VhYBzFPzygfJAczJgA4lAc8LHw/MUM7Lf3QkAc8LAnQkAc8LAnAWzwsBydAPyXEVzwsBUPXOUP7KBw7JUCLMyVYUVQLMcc8LAMxwzwsAySD5AB3PC//J0FIMzlAO+gJWHgH0AHD6AnD6AnPPC2EbzHHPCwAczMlz+wDIUarLH0AA+BjOdioBzwsDcBvPCwHJ0AHJCs7OcPoCgBphAfQAcPoCcPoCcc8LYRjMyYEAgPsAyHAhAc8LAIAUYQHLP3ESzwsAG86AEmFVCsyAEWEBzFUPAcsHH8v/Hct/E8t/GsxQvfoCyVAMzMntVIAMMTExMTExMTExMTExVQEwAdkCaiLBDo6A4e1E0NMAAcAA8r/TP9TU0wfT/9N/03/U1dMAjoACwACZcHAjAVURVQLZ4PpAcSPZS0ICag7THyDXS3D4ZI6AgQKHIwG8BvoAjoAxJwHhBNIH0//T/yRwXzBVGVUUAVULVQZVN1UZVQvZRkMBio4iW9P/INdLgQCAIgG5KeFxuvLgQ8AA8uBC1SdwVREBVREB2YECByUBvI6A4QXSB9P/J3BfIFUYVQNVGFUKVShVGFUK2UQB/o4iW9P/INdLgQEAIgG5JuFxuvLgQ8AA8uBC1SRwVREBVREB2YEBByYBvI5KJcIHjiMwBtIHINdLgQEAIgG5KuFxuvLgQ8AA8uBC1ShwVREBVREB2SBZAVUB4HEWuvLgQwXAAPLgQgXVJHBVEQFVAVUTVSVVB9nhBtIHJ3BwVQFFAALZAbhbgBxh0wDTANMA+kDtR28QbxcB+kAH03/RjoApwAAJ+gAwBG8QFKJT0LlUEA7jBHL7Ao4UcHBVAjAjVQJVNlUXVQlVGAFVCdkoAeDIdM8LAisBygcZy//J0HEj2UcBkMhwIQHPCwBwIQHPCz/4KCPOViFVAcxWIAHMVh8Bywdwzwt/Vh4By/8ey/+OgJMiIdklAeFxJAHPCwAWziVwVQUBVSNVBlUV2UgB/lYcAcxWECTKB8kBzMlQD8x0JAHPCwJ0JAHPCwJwFs8LAcnQAslQJc4BVQ/PCgdxFM8LAYAkYcAAUFPMyVYbVQTMcc8LAMxwzwsAySD5ABTPC//J0FICzlAN+gJWJQH0AHD6AnD6AnPPC2ESzHDPCyDJc/sAyIATYSHLHxzOdixJAcABzwsDcB3PCwHJ0AHJDM4WznD6AoAiYQH0AHD6AnD6AnHPC2EazMmBAID7AMhwIQHPCwCAHWEhyz+AHWEBzIAcYQHMgBthAcsHgBphAcv/gBlhAct/gBhhAct/gBdhAcxKAJiOKDAO+gLJUA3Mye1UgA0xMTExMTExMTExMTExMTExMTExMTExVQEwAdknIeBxFM8LAIAVYQHOI3BVHwFVl1UPVQxVHgGAEWGAEWHZAmoiwQ+OgOHtRNDTAAHAAPK/0z/U1NMH0//Tf9N/1NXTAI6AAsAAmXBxI1URAVUR2eD6QHAj2U5MAf5w+GQB+gAwDvADA/LQaYATYdMA0wDTAPpAMCcBxwXAAPLQZF8DUgigU4C58tBl+ADIdiEBzwsDcCIBzwsBydABzoAOgA4TzwsfGst/UDnOCMlQg/oCgBNhAfQAcPoCcPoCcc8LYRLMyXP7AMhwIQHPCwAdyz9xHc8LABLOUKvMTQBEGMwWywcUy/8Sy3/Lf8xQRvoCyVAFzMntVDExMTFVATAB2QFoAsAPIuHtRNDTAAHAAPK/0z/U1NMH0//Tf9N/1NXTAI6AAsAAmXBwIwFVEVUC2eD6QHEj2U8B/i3XS3D4ZCHCfwT6AI5uMFUP03/RBMAA8tBpgBNh0wDTANMA+kAwKQHHBcAA8tBk+ADIcSEBzwsAcBLPCwCAFGEByz+AE2EBzFCqzlAE+gLJUG2gUPfMHcsHG8v/FMt/F8t/FcwWzMntVIAPMTExMTExMTExVQEwVQEwAdkxJSFQAEjgcRO68uBDAsAA8uBCD9VWEHBVAVXEVQ9VDoARYYASYYASYdk=",
    code: "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",
    codeHash: "7bcb2edc27154c4f58642dddfc52035ac5bcca63f23babacd2a934b7b71097d2",
};
module.exports = { RootTokenContractContract };