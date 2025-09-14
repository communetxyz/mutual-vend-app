// Production configuration for vending machine - GNOSIS CHAIN ONLY
export const VENDING_MACHINE_ADDRESS =
  process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS || "0x9be9d9d4d5a2bc9fade4e5a70d9191b3c9c08f6b"

export const GNOSIS_RPC_URL = process.env.NEXT_PUBLIC_GNOSIS_RPC_URL || "https://rpc.gnosischain.com"

export const CHAIN_ID = 100 // Gnosis Chain only
export const NETWORK_NAME = "Gnosis Chain"

// Fallback RPC URLs for Gnosis Chain redundancy
export const FALLBACK_RPC_URLS = [
  "https://rpc.gnosischain.com",
  "https://gnosis-mainnet.public.blastapi.io",
  "https://gnosis.blockpi.network/v1/rpc/public",
  "https://rpc.ankr.com/gnosis",
]

export const GNOSIS_CHAIN_CONFIG = {
  chainId: CHAIN_ID,
  chainName: NETWORK_NAME,
  nativeCurrency: {
    name: "xDAI",
    symbol: "xDAI",
    decimals: 18,
  },
  rpcUrls: [GNOSIS_RPC_URL, ...FALLBACK_RPC_URLS],
  blockExplorerUrls: ["https://gnosisscan.io"],
}

// Contract interaction settings
export const CONTRACT_SETTINGS = {
  gasLimitMultiplier: 1.2, // 20% buffer for gas estimation
  maxRetries: 3,
  retryDelay: 2000, // 2 seconds
  transactionTimeout: 300000, // 5 minutes
}

// UI Configuration
export const UI_CONFIG = {
  refreshInterval: 30000, // 30 seconds
  transactionPollingInterval: 2000, // 2 seconds
  maxTransactionHistory: 50,
  priceDisplayDecimals: 4,
}

console.log("=== Gnosis Chain Vending Machine ===")
console.log("Contract Address:", VENDING_MACHINE_ADDRESS)
console.log("Network:", NETWORK_NAME, `(${CHAIN_ID})`)
console.log("RPC URL:", GNOSIS_RPC_URL)
console.log("Block Explorer: https://gnosisscan.io")
console.log("====================================")
