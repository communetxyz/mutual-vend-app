// Contract addresses on Sepolia
export const CONTRACT_ADDRESSES = {
  VENDING_MACHINE: "0xffBe0620a4BFE0594ce6e9ce8b52C69Df04301eA" as `0x${string}`,
  VOTE_TOKEN: "0xe93d2AD6Cd912939e72f3131c342E8018E395E11" as `0x${string}`,
  MOCK_USDC: "0x1cF3abD8278F0453657AAD78208D0601bB186a62" as `0x${string}`,
} as const

export const SEPOLIA_CHAIN_ID = 11155111
export const NETWORK_NAME = "Sepolia"

// Role constants
export const ROLES = {
  DEFAULT_ADMIN_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
  OPERATOR_ROLE: "0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929" as `0x${string}`, // keccak256("OPERATOR_ROLE")
  TREASURY_ROLE: "0x3496274819ff0b8e4bc42fb6f7dc4f8d71f79e79e5a3b0de3b7e0c6b9a3b8df7" as `0x${string}`, // keccak256("TREASURY_ROLE")
  MINTER_ROLE: "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6" as `0x${string}`, // keccak256("MINTER_ROLE")
} as const