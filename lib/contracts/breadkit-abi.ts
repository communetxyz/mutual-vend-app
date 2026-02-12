// BreadKit Distribution Module ABI - extracted from crowdstake.fun interfaces
export const BREADKIT_DISTRIBUTION_ABI = [
  {
    "type": "function",
    "name": "distributeYield",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", 
    "name": "getCurrentDistributionState",
    "inputs": [],
    "outputs": [
      {
        "name": "state",
        "type": "tuple",
        "internalType": "struct IDistributionModule.DistributionState",
        "components": [
          {
            "name": "totalYield",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "fixedAmount",
            "type": "uint256", 
            "internalType": "uint256"
          },
          {
            "name": "votedAmount",
            "type": "uint256",
            "internalType": "uint256" 
          },
          {
            "name": "totalVotes",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lastDistributionBlock",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "cycleNumber",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "recipients",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "votedDistributions",
            "type": "uint256[]",
            "internalType": "uint256[]"
          },
          {
            "name": "fixedDistributions", 
            "type": "uint256[]",
            "internalType": "uint256[]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "validateDistribution", 
    "inputs": [],
    "outputs": [
      {
        "name": "canDistribute",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "reason",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setCycleLength",
    "inputs": [
      {
        "name": "_cycleLength",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setYieldFixedSplitDivisor", 
    "inputs": [
      {
        "name": "_divisor",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "YieldDistributed",
    "inputs": [
      {
        "name": "totalYield",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "totalVotes",
        "type": "uint256", 
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "recipients",
        "type": "address[]",
        "indexed": false,
        "internalType": "address[]"
      },
      {
        "name": "votedDistributions",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "fixedDistributions",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CycleCompleted",
    "inputs": [
      {
        "name": "cycleNumber",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "blockNumber", 
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const

// BreadKit Voting Module ABI
export const BREADKIT_VOTING_ABI = [
  {
    "type": "function",
    "name": "vote",
    "inputs": [
      {
        "name": "points",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", 
    "name": "castVote",
    "inputs": [
      {
        "name": "points",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getVotingPower",
    "inputs": [
      {
        "name": "account",
        "type": "address", 
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentVotingDistribution",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "validateVotePoints",
    "inputs": [
      {
        "name": "points",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "delegate",
    "inputs": [
      {
        "name": "delegatee",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setMaxPoints", 
    "inputs": [
      {
        "name": "maxPoints",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const