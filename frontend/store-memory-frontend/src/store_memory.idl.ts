export const IDL = {
  "version": "0.1.0",
  "name": "store_memory",
  "instructions": [
    {
      "name": "store",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "memory",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "memory",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "memory",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "memory",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MemoryTooLong",
      "msg": "The provided memory exceeds the maximum allowed length."
    }
  ]
} as const;