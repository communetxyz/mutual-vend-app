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
      <Card className="w-full max-w-md border-2 border-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Wallet className="h-6 w-6 text-secondary" />
            Wallet Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Connected via: {connector?.name}</p>
            <p className="font-semibold text-foreground mt-3">Address:</p>
            <p className="font-mono text-xs break-all bg-muted p-3 rounded-lg mt-1">{address}</p>
          </div>
          <Button onClick={() => disconnect()} variant="outline" className="w-full border-2">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-2 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <Wallet className="h-6 w-6 text-primary" />
          Connect Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-muted-foreground">
          Connect your wallet to start purchasing from the vending machine on Gnosis Chain.
        </p>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm text-destructive font-medium">Connection failed: {error.message}</p>
          </div>
        )}

        <div className="space-y-3">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              variant="outline"
              className="w-full justify-start h-12 border-2 hover:border-primary/50 hover:bg-primary/5"
              disabled={isPending || isConnecting === connector.id}
            >
              <div className="flex items-center gap-3">
                {getConnectorIcon(connector.id)}
                <span className="font-medium">{getConnectorName(connector)}</span>
                {isConnecting === connector.id && (
                  <div className="ml-auto">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        <div className="text-sm text-muted-foreground space-y-2 p-4 bg-muted/50 rounded-lg">
          <p>• WalletConnect: Mobile wallets (Trust, Rainbow, etc.)</p>
          <p>• MetaMask: Browser extension</p>
          <p>• Coinbase Wallet: Coinbase's wallet app</p>
          <p>• Browser Wallet: Any injected wallet</p>
        </div>
      </CardContent>
    </Card>
  )
}
