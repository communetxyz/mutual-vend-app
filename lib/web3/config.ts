import { createConfig, http } from "wagmi"
import { gnosis } from "wagmi/chains"
import { metaMask, walletConnect, injected, coinbaseWallet } from "wagmi/connectors"

export const config = createConfig({
  chains: [gnosis], // Only Gnosis Chain
  connectors: [
    injected(),
    metaMask({
      dappMetadata: {
        name: "Mutual Vend",
        url: "https://mutualvend.com",
      },
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "549077143e5bfa40a6c5f280e0b0d13e",
      metadata: {
        name: "Mutual Vend",
        description: "Decentralized Vending Machine Network",
        url: "https://mutual-vend.com", // Fixed URL to match actual domain
        icons: ["https://mutual-vend.com/icon.png"], // Fixed URL to match actual domain
      },
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: "Mutual Vend",
      appLogoUrl: "https://mutual-vend.com/icon.png", // Fixed URL to match actual domain
    }),
  ],
  transports: {
    [gnosis.id]: http(process.env.NEXT_PUBLIC_GNOSIS_RPC_URL || "https://rpc.gnosischain.com"),
  },
  // Ensure we default to Gnosis Chain
  ssr: true,
})

export const VENDING_MACHINE_ADDRESS = "0x6699fb5cdADb6065c71457Dc44A6f9d0688a5e4c" as `0x${string}`
export const CHAIN_ID = 100 // Gnosis Chain ID
export const NETWORK_NAME = "Gnosis Chain"
