import { http, createConfig } from "wagmi"
import { gnosis } from "wagmi/chains"
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors"

// Environment variables
export const VENDING_MACHINE_ADDRESS = process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS as `0x${string}`
export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

// Wagmi configuration
export const config = createConfig({
  chains: [gnosis],
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
    }),
    coinbaseWallet({
      appName: "Mutual Vend",
    }),
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
