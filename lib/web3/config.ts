import { createConfig, http } from "wagmi"
import { gnosis } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

export const VENDING_MACHINE_ADDRESS = process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS as `0x${string}`

export const config = createConfig({
  chains: [gnosis],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
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
