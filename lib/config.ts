// Use environment variables with proper fallbacks
export const VENDING_MACHINE_ADDRESS =
  process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS || "0xbC6801c96d6Ce3935C070087f0bc05E70231ACc6"
export const GNOSIS_RPC_URL = process.env.NEXT_PUBLIC_GNOSIS_RPC_URL || "https://rpc.gnosischain.com"
export const CHAIN_ID = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "100")
export const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME || "Gnosis Chain"

export const GNOSIS_CHAIN = {
  id: 100,
  name: "Gnosis Chain",
  network: "gnosis",
  nativeCurrency: {
    decimals: 18,
    name: "xDAI",
    symbol: "XDAI",
  },
  rpcUrls: {
    default: { http: ["https://rpc.gnosischain.com"] },
    public: { http: ["https://rpc.gnosischain.com"] },
  },
  blockExplorers: {
    default: { name: "Gnosisscan", url: "https://gnosisscan.io" },
  },
  testnet: false,
}

// Debug logging to verify configuration
if (typeof window !== "undefined") {
  console.log("=== Gnosis Chain Configuration ===")
  console.log("Contract Address:", VENDING_MACHINE_ADDRESS)
  console.log("RPC URL:", GNOSIS_RPC_URL)
  console.log("Chain ID:", CHAIN_ID)
  console.log("Network Name:", NETWORK_NAME)
  console.log("==================================")
}
