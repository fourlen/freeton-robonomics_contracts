from tonclient.types import ClientConfig, ParamsOfDecodeMessageBody, Abi, ParamsOfQuery, ParamsOfDecodeBoc, AbiParam
from tonclient.client import TonClient, DEVNET_BASE_URLS
from time import sleep
from BulbCommunication import turn_on_off_bulb_irl


client_config = ClientConfig()
client_config.network.endpoints = DEVNET_BASE_URLS    #you can change network here
client = TonClient(config=client_config)


lighthouse_abi = Abi.from_path('../artifacts/Lighthouse.abi.json') #path to the lighthouse abi
print(lighthouse_abi)

def decode_bytes_string(bytes_string):
  decoded = ''
  for i in range(0, len(bytes_string), 2):
    decoded += chr(int('0x' + bytes_string[i:i + 2], base=16))
  return decoded


def decode_lighthouse_internal_message_body(msg_body):
  return client.abi.decode_message_body(
      ParamsOfDecodeMessageBody(
          abi=lighthouse_abi,
          body=msg_body,
          is_internal=True
      )
  )


def get_demand_cell(decoded_msg_body):
  return client.abi.decode_boc(
    ParamsOfDecodeBoc(
      boc=decoded_msg_body.value['demandCell'],
      allow_partial=True,
      params=[
        AbiParam('terms', 'ref(tuple)', components=[
          AbiParam('model', 'bytes'),
          AbiParam('objective', 'bytes'),
          AbiParam('cost', 'uint128'),
          AbiParam('token', 'address'),
          AbiParam('penalty', 'uint128'),
          AbiParam('validator', 'ref(tuple)', components=[
            AbiParam('contract', 'optional(address)'),
            AbiParam('pubkey', 'optional(uint256)')
          ])
        ]),
        AbiParam('isDemand', 'bool'),
        AbiParam('lighthouse', 'address'),
        AbiParam('customerAddress', 'address'),
        AbiParam('customerPubKey', 'uint256')
      ]
    )
  ).data


#change lighthouse address here
def get_lighthouse_transactions():
  return client.net.query(
        params=ParamsOfQuery(
            """
    query {
      blockchain{
      account(address:"0:ff655749261b7e0dd3a1db2c7a0c7d7b541ecc1589a5d3cd675e05469aab8051"){
        transactions{
          edges{
            node{
              id
              hash
              in_msg
              out_msgs
            }
          }
          pageInfo{
            endCursor
            hasNextPage
          }
        }
      }
      }
    }
    """
        )
    ).result['data']['blockchain']['account']['transactions']['edges']


def get_msg_body(msg_hash):
  return client.net.query(
        ParamsOfQuery("""
    query($msg_hash:String!){
      blockchain{
        message(hash: $msg_hash){
          body
        }
      }
    }
    """,
      variables={
      'msg_hash': msg_hash
    })
    ).result['data']['blockchain']['message']['body']


def main():

  print('Start polling...')
  
  transactions_count = len(get_lighthouse_transactions())

  print('Transactions count: ', transactions_count )
  while True:
    res = get_lighthouse_transactions()
    if len(res) == transactions_count:
      sleep(1)
      continue
    
    print('Transaction catched!')

    transactions_count = len(res)
    
    last_transaction = res[-1]


    in_msg_body = get_msg_body(last_transaction['node']['in_msg'])
    decoded_msg_body = client.abi.decode_message_body(
        ParamsOfDecodeMessageBody(
            abi=lighthouse_abi,
            body=in_msg_body,
            is_internal=True
        )
    )

    demand = get_demand_cell(decoded_msg_body)
    demand_objective = decode_bytes_string(demand['terms']['objective'])

    if demand_objective == 'Turn on/off a bulb':
      turn_on_off_bulb_irl()


if __name__ == '__main__':
  main()