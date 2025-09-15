import { createConfig, http } from "wagmi"
import { gnosis } from "wagmi/chains"
import { walletConnect, injected } from "wagmi/connectors"

// Vending Machine Contract Address
export const VENDING_MACHINE_ADDRESS = process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS as `0x${string}`

// Network Configuration
export const SUPPORTED_CHAINS = [gnosis]
export const DEFAULT_CHAIN = gnosis

// WalletConnect Project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set")
}

if (!VENDING_MACHINE_ADDRESS) {
  throw new Error("NEXT_PUBLIC_VENDING_MACHINE_ADDRESS is not set")
}

// Wagmi Configuration
export const config = createConfig({
  chains: [gnosis],
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        name: "Mutual Vend",
        description: "Decentralized Vending Machine Network",
        url: "https://mutualvend.com",
        icons: ["https://mutualvend.com/icon.png"],
      },
    }),
    injected(),
  ],
  transports: {
    [gnosis.id]: http(process.env.NEXT_PUBLIC_GNOSIS_RPC_URL),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
