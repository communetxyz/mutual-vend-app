"use client"

import type React from "react"

import { WagmiProvider, createConfig, http } from "wagmi"
import { gnosis } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"

const config = createConfig(
  getDefaultConfig({
    chains: [gnosis],
    transports: {
      [gnosis.id]: http(process.env.NEXT_PUBLIC_GNOSIS_RPC_URL),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: "Mutual Vend",
    appDescription: "Decentralized Vending Machine Network",
    appUrl: "https://mutual-vend.com",
    appIcon: "https://mutual-vend.com/icon.png",
  }),
)

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="auto"
          mode="light"
          options={{
            initialChainId: gnosis.id,
            enforceSupportedChains: true,
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
