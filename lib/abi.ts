const contractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_oracle",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CallbackNotAuthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficentFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidContent",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "x",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "y",
                type: "uint256",
              },
            ],
            internalType: "struct G1Point",
            name: "random",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "cipher",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "x",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "y",
                type: "uint256",
              },
            ],
            internalType: "struct G1Point",
            name: "random2",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "f",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "e",
                type: "uint256",
              },
            ],
            internalType: "struct DleqProof",
            name: "dleq",
            type: "tuple",
          },
        ],
        indexed: true,
        internalType: "struct Ciphertext",
        name: "cipher",
        type: "tuple",
      },
    ],
    name: "ContentDecryption",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "licensee",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "contentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum LicenseType",
        name: "licenseType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "LicenseBought",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contributor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "contentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "NewContribution",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cipherId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "x",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "y",
            type: "uint256",
          },
        ],
        internalType: "struct G1Point",
        name: "buyerPublicKey",
        type: "tuple",
      },
      {
        internalType: "enum LicenseType",
        name: "licenseType",
        type: "uint8",
      },
    ],
    name: "buyLicense",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "x",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "y",
                type: "uint256",
              },
            ],
            internalType: "struct G1Point",
            name: "random",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "cipher",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "x",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "y",
                type: "uint256",
              },
            ],
            internalType: "struct G1Point",
            name: "random2",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "f",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "e",
                type: "uint256",
              },
            ],
            internalType: "struct DleqProof",
            name: "dleq",
            type: "tuple",
          },
        ],
        internalType: "struct Ciphertext",
        name: "cipher",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "contribute",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "contributions",
    outputs: [
      {
        internalType: "address",
        name: "contributor",
        type: "address",
      },
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "contributors",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oracle",
    outputs: [
      {
        internalType: "contract IEncryptionOracle",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "x",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "y",
                type: "uint256",
              },
            ],
            internalType: "struct G1Point",
            name: "random",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "cipher",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "x",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "y",
                type: "uint256",
              },
            ],
            internalType: "struct G1Point",
            name: "random2",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "f",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "e",
                type: "uint256",
              },
            ],
            internalType: "struct DleqProof",
            name: "dleq",
            type: "tuple",
          },
        ],
        internalType: "struct Ciphertext",
        name: "cipher",
        type: "tuple",
      },
    ],
    name: "oracleResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dest",
        type: "address",
      },
    ],
    name: "payments",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "payee",
        type: "address",
      },
    ],
    name: "withdrawPayments",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default contractABI;
