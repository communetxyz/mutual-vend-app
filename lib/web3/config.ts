import { createConfig, http } from "wagmi"
import { gnosis } from "wagmi/chains"
import { metaMask, walletConnect, injected } from "wagmi/connectors"

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
      projectId: "your-project-id",
      metadata: {
        name: "Mutual Vend",
        description: "Decentralized Vending Machine",
        url: "https://mutualvend.com",
        icons: ["https://mutualvend.com/icon.png"],
      },
    }),
  ],
  transports: {
    [gnosis.id]: http(process.env.NEXT_PUBLIC_GNOSIS_RPC_URL || "https://rpc.gnosischain.com"),
  },
  // Ensure we default to Gnosis Chain
  ssr: true,
})

export const VENDING_MACHINE_ADDRESS = "0xbde69CD8cbA0d15942111e51AF13bf9685FDBC33" as `0x${string}`
export const CHAIN_ID = 100 // Gnosis Chain ID
export const NETWORK_NAME = "Gnosis Chain"
