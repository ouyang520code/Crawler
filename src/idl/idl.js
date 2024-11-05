export const IDL = {
  "version": "0.1.0",
  "name": "pda_account",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "pdaAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "buyNode",
      "accounts": [
        { "name": "userTokenAccount", "isMut": true, "isSigner": false },
        { "name": "tokenMint", "isMut": true, "isSigner": false },
        { "name": "burnAuthority", "isMut": false, "isSigner": true },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "pdaAccount", "isMut": true, "isSigner": false },
        { "name": "receiver", "isMut": true, "isSigner": false }
      ],
      "args": [{ "name": "amount", "type": "u64" }],
      "returns": { "defined": "Response" }
    },
    {
      "name": "initUserData",
      "accounts": [
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "pdaAccount", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "mintNft",
      "accounts": [
        { "name": "pdaAccount", "isMut": true, "isSigner": false },
        { "name": "metaplexTokenMetadata", "isMut": false, "isSigner": false },
        { "name": "editionMetadata", "isMut": true, "isSigner": false },
        { "name": "edition", "isMut": true, "isSigner": false },
        { "name": "editionMint", "isMut": true, "isSigner": false },
        {
          "name": "editionTokenAccountOwner",
          "isMut": false,
          "isSigner": false
        },
        { "name": "editionTokenAccount", "isMut": true, "isSigner": false },
        { "name": "editionMintAuthority", "isMut": true, "isSigner": false },
        { "name": "masterEdition", "isMut": true, "isSigner": false },
        { "name": "editionMarkerPda", "isMut": true, "isSigner": false },
        { "name": "payer", "isMut": true, "isSigner": false },
        {
          "name": "masterTokenAccountOwner",
          "isMut": false,
          "isSigner": false
        },
        { "name": "masterTokenAccount", "isMut": true, "isSigner": false },
        { "name": "masterMetadata", "isMut": false, "isSigner": false },
        { "name": "updateAuthority", "isMut": false, "isSigner": false },
        { "name": "splTokenProgram", "isMut": false, "isSigner": false },
        { "name": "splAtaProgram", "isMut": false, "isSigner": false },
        { "name": "sysvarInstructions", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "tokenMint", "isMut": true, "isSigner": false },
        { "name": "userTokenAccount", "isMut": true, "isSigner": false },
        { "name": "adminData", "isMut": true, "isSigner": false }
      ],
      "args": [
        { "name": "editionNumber", "type": "u64" },
        { "name": "amount", "type": "u64" }
      ]
    },
    {
      "name": "setAmount",
      "accounts": [
        { "name": "owner", "isMut": true, "isSigner": true },
        { "name": "pdaAccount", "isMut": true, "isSigner": false },
        { "name": "adminData", "isMut": true, "isSigner": false }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    },
    {
      "name": "setPayAmount",
      "accounts": [
        { "name": "owner", "isMut": true, "isSigner": true },
        { "name": "pdaAccount", "isMut": true, "isSigner": false },
        { "name": "adminData", "isMut": true, "isSigner": false }
      ],
      "args": [{ "name": "payAmount", "type": "u64" }]
    },
    {
      "name": "setAdminData",
      "accounts": [
        { "name": "owner", "isMut": true, "isSigner": true },
        { "name": "adminData", "isMut": true, "isSigner": false }
      ],
      "args": [
        { "name": "address", "type": { "option": "publicKey" } },
        { "name": "solFree", "type": { "option": "f64" } }
      ]
    },
    {
      "name": "mintPoint",
      "accounts": [
        { "name": "form", "isMut": false, "isSigner": false },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "pdaAccount", "isMut": true, "isSigner": false },
        {
          "name": "tokenMetadataProgramInfo",
          "isMut": false,
          "isSigner": false
        },
        { "name": "tokenInfo", "isMut": true, "isSigner": false },
        { "name": "tokenOwnerInfo", "isMut": true, "isSigner": false },
        { "name": "metadataInfo", "isMut": false, "isSigner": false },
        { "name": "masterEditionInfo", "isMut": true, "isSigner": false },
        { "name": "mintInfo", "isMut": true, "isSigner": false },
        { "name": "payerInfo", "isMut": true, "isSigner": false },
        { "name": "updateAuthorityInfo", "isMut": true, "isSigner": false },
        { "name": "systemProgramInfo", "isMut": false, "isSigner": false },
        { "name": "sysvarInstructionsInfo", "isMut": false, "isSigner": false },
        { "name": "splTokenProgramInfo", "isMut": false, "isSigner": false },
        { "name": "splAtaProgramInfo", "isMut": false, "isSigner": false }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "DataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "user", "type": "publicKey" },
          { "name": "bump", "type": "u8" },
          { "name": "amount", "type": "u64" },
          { "name": "payAmount", "type": "u64" }
        ]
      }
    },
    {
      "name": "Admin",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "owner", "type": "publicKey" },
          { "name": "bump", "type": "u8" },
          { "name": "isInit", "type": "bool" },
          { "name": "tranSol", "type": "publicKey" },
          { "name": "solFreeNum", "type": "f64" },
          { "name": "editionNumber", "type": "u64" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Response",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "message", "type": "string" },
          { "name": "value", "type": "u64" }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AmountTooSmall",
      "msg": "The amount must be multiple of 100."
    },
    {
      "code": 6001,
      "name": "Inits",
      "msg": "Please don't repeat the initialization."
    },
    {
      "code": 6002,
      "name": "InsufficientFunds",
      "msg": "Insufficient balance"
    },
    {
      "code": 6003,
      "name": "InvalidBurnAuthority",
      "msg": "Invalid burn authority"
    },
    {
      "code": 6004,
      "name": "InsufficientBalance",
      "msg": "Insufficient balance in user token account"
    },
    { "code": 6005, "name": "InvalidPDAAccount", "msg": "Invalid PDA account" },
    { "code": 6006, "name": "AmountMintErr", "msg": "mint amount is wrong" },
    {
      "code": 6007,
      "name": "EditionNumberErr",
      "msg": "Failed to obtain the major version number"
    },
    { "code": 6008, "name": "InvalidAccountData", "msg": "Incorrect data" },
    { "code": 6009, "name": "TokenMintErr", "msg": "Transfer to tokens" },
    { "code": 6010, "name": "AddressErr", "msg": "Address error" }
  ]
}