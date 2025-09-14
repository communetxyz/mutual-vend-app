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
    [gnosis.id]: http(process.env.NEXT_PUBLIC_GNOSIS_RPC_URL),
  },
})

export const VENDING_MACHINE_ADDRESS = process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS as `0x${string}`
export const CHAIN_ID = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "100")
export const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME || "Gnosis"
