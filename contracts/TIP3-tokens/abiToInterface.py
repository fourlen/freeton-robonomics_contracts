import json
import sys

def printHelp():
    print("Use: python3 abiToInterface.py <contract> [-o] [<path>]")
    print("Reads abi from <contract>.abi.json file and writes solidity code to stdout.")
    print("If [-o] specified, wraps the code with the pragmas and interface declaration and outputs it to <path>/I<filename>.sol")

args = sys.argv[1:]
if not len(args) in [1, 2, 3]:
    printHelp()
    exit(1)
if len(args) >= 2 and args[1] != "-o":
    printHelp()
    exit(1)


contract = args[0]
if len(args) >= 2:
    wrapper = lambda code: "pragma ton-solidity >= 0.42.0;\ninterface I" + contract + " {\n" + '\n'.join(map(lambda line: '    ' + line, code.split('\n'))) + "\n}"
    path = "./"
    if len(args) == 3:
    	path = args[2]
else:
    wrapper = lambda x: x


with open(contract + ".abi.json") as f:
    data = json.load(f)['functions']

def abiTypesToSolidityTypes(t):
    if t == "cell":
        return "TvmCell"
    return t

def translateParam(param):
    return abiTypesToSolidityTypes(param['type']) + ' ' + param['name']

def translateOneEnrty(func):
    code = ""
    if func['name'] != "constructor":
        code += "function "
    code += func['name']
    code += "({}) external".format(', '.join(map(translateParam, func['inputs'])))
    outputs = func.get('outputs', [])
    if len(outputs) > 0:
        code += " returns ({})".format(', '.join(map(translateParam, outputs)))
    code += ";"
    return code

code = '\n'.join(map(translateOneEnrty, data))
code = wrapper(code)

if len(args) == 1:
    print(code)
else:
    f = open(path + 'I' + contract + '.sol', 'w')
    f.write(code)
    f.close()
