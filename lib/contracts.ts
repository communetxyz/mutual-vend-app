// Re-export individual contract ABIs
export { VENDING_MACHINE_ABI } from "./contracts/vending-machine-abi"
export { ERC20_ABI } from "./contracts/erc20-abi"

// BREAD token configuration
export const BREAD_TOKEN = {
  address: "0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3" as const,
  symbol: "BREAD",
  decimals: 18,
  name: "Breadchain Community Token",
}
