import { http, createConfig } from "wagmi"
import { sepolia, gnosis } from "wagmi/chains"
import { walletConnect, metaMask, coinbaseWallet } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

export const config = createConfig({
  chains: [sepolia, gnosis],
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        name: "Mutual Vend",
        description: "Decentralized vending machine platform",
        url: "https://mutual-vend.com",
        icons: ["https://mutual-vend.com/favicon.ico"],
      },
    }),
    metaMask(),
    coinbaseWallet({
      appName: "Mutual Vend",
      appLogoUrl: "https://mutual-vend.com/favicon.ico",
    }),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    [gnosis.id]: http(process.env.NEXT_PUBLIC_GNOSIS_RPC_URL),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
