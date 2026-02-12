import { createConfig, http } from "wagmi"
import { sepolia } from "wagmi/chains"
import { metaMask, walletConnect, injected, coinbaseWallet } from "wagmi/connectors"

export const config = createConfig({
  chains: [sepolia],
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
        url: "https://mutualvend.com",
        icons: ["https://mutualvend.com/icon.png"],
      },
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: "Mutual Vend",
      appLogoUrl: "https://mutualvend.com/icon.png",
    }),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/Rr57Q41YGfkxYkx0kZp3EOQs86HatGGE"),
  },
  ssr: true,
})

export const VENDING_MACHINE_ADDRESS = "0xffBe0620a4BFE0594ce6e9ce8b52C69Df04301eA" as `0x${string}`
export const CHAIN_ID = 11155111 // Sepolia
export const NETWORK_NAME = "Sepolia"
