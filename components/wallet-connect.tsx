"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, LogOut, Smartphone, Chrome, Coins } from "lucide-react"
import { useState } from "react"

export function WalletConnect() {
  const { address, isConnected, connector } = useAccount()
  const { connectors, connect, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [isConnecting, setIsConnecting] = useState<string | null>(null)

  const handleConnect = async (connector: any) => {
    try {
      setIsConnecting(connector.id)
      await connect({ connector })
    } catch (err) {
      console.error("Connection failed:", err)
    } finally {
      setIsConnecting(null)
    }
  }

  const getConnectorIcon = (connectorId: string) => {
    switch (connectorId) {
      case "walletConnect":
        return <Smartphone className="h-4 w-4" />
      case "metaMask":
        return <Chrome className="h-4 w-4" />
      case "coinbaseWallet":
        return <Coins className="h-4 w-4" />
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  const getConnectorName = (connector: any) => {
    switch (connector.id) {
      case "walletConnect":
        return "WalletConnect"
      case "metaMask":
        return "MetaMask"
      case "coinbaseWallet":
        return "Coinbase Wallet"
      case "injected":
        return "Browser Wallet"
      default:
        return connector.name
    }
  }

  if (isConnected && address) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium">Connected via: {connector?.name}</p>
            <p className="font-medium mt-2">Address:</p>
            <p className="font-mono text-xs break-all bg-gray-100 dark:bg-gray-800 p-2 rounded">{address}</p>
          </div>
          <Button onClick={() => disconnect()} variant="outline" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Connect your wallet to start purchasing from the vending machine on Gnosis Chain.
        </p>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">Connection failed: {error.message}</p>
          </div>
        )}

        <div className="space-y-2">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              variant="outline"
              className="w-full justify-start"
              disabled={isPending || isConnecting === connector.id}
            >
              <div className="flex items-center gap-3">
                {getConnectorIcon(connector.id)}
                <span>{getConnectorName(connector)}</span>
                {isConnecting === connector.id && (
                  <div className="ml-auto">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• WalletConnect: Mobile wallets (Trust, Rainbow, etc.)</p>
          <p>• MetaMask: Browser extension</p>
          <p>• Coinbase Wallet: Coinbase's wallet app</p>
          <p>• Browser Wallet: Any injected wallet</p>
        </div>
      </CardContent>
    </Card>
  )
}
