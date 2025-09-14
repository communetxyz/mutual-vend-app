import { createConfig, http } from "wagmi"
import { gnosis } from "wagmi/chains"
import { metaMask, walletConnect } from "wagmi/connectors"

export const config = createConfig({
  chains: [gnosis],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: "your-project-id", // Replace with your WalletConnect project ID
    }),
  ],
  transports: {
    [gnosis.id]: http(process.env.NEXT_PUBLIC_GNOSIS_RPC_URL || "https://rpc.gnosischain.com"),
  },
})

export const VENDING_MACHINE_ADDRESS = (process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS ||
  "0xbde69CD8cbA0d15942111e51AF13bf9685FDBC33") as `0x${string}`
export const CHAIN_ID = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "100")
export const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME || "Gnosis"

// Gnosis Chain configuration
export const GNOSIS_CHAIN = {
  id: 100,
  name: "Gnosis",
  network: "gnosis",
  nativeCurrency: {
    decimals: 18,
    name: "xDAI",
    symbol: "XDAI",
  },
  rpcUrls: {
    public: { http: ["https://rpc.gnosischain.com"] },
    default: { http: ["https://rpc.gnosischain.com"] },
  },
  blockExplorers: {
    etherscan: { name: "Gnosisscan", url: "https://gnosisscan.io" },
    default: { name: "Gnosisscan", url: "https://gnosisscan.io" },
  },
}
