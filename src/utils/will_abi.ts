export const WILL_ABI = {
    "address": "0x937faeae1a19e86a0b35bf99ce606e02b9d223a37fb1189e33bee708324345e9",
    "name": "will",
    "friends": [],
    "exposed_functions": [
      {
        "name": "initialize",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer"
        ],
        "return": []
      },
      {
        "name": "claim",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer",
          "address"
        ],
        "return": []
      },
      {
        "name": "create_will",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer",
          "address",
          "u64"
        ],
        "return": []
      },
      {
        "name": "get_will",
        "visibility": "public",
        "is_entry": false,
        "is_view": true,
        "generic_type_params": [],
        "params": [
          "address"
        ],
        "return": [
          "0x1::option::Option\u003C0x937faeae1a19e86a0b35bf99ce606e02b9d223a37fb1189e33bee708324345e9::will::Will\u003E"
        ]
      },
      {
        "name": "ping",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer"
        ],
        "return": []
      }
    ],
    "structs": [
      {
        "name": "Will",
        "is_native": false,
        "is_event": false,
        "abilities": [
          "copy",
          "drop",
          "store"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "owner",
            "type": "address"
          },
          {
            "name": "recipient",
            "type": "address"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "last_ping_time",
            "type": "u64"
          },
          {
            "name": "timeout_secs",
            "type": "u64"
          }
        ]
      },
      {
        "name": "WillState",
        "is_native": false,
        "is_event": false,
        "abilities": [
          "key"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "wills",
            "type": "0x1::table::Table\u003Caddress, 0x937faeae1a19e86a0b35bf99ce606e02b9d223a37fb1189e33bee708324345e9::will::Will\u003E"
          },
          {
            "name": "balances",
            "type": "0x1::table::Table\u003Caddress, 0x1::coin::Coin\u003C0x1::aptos_coin::AptosCoin\u003E\u003E"
          }
        ]
      }
    ]
  } as const;
