"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useConnect, useAccount, useDisconnect } from "wagmi"
import { Wallet, LogOut } from "lucide-react"

export function WalletConnect() {
  const { connectors, connect, isPending } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>{address && `${address.slice(0, 6)}...${address.slice(-4)}`}</CardDescription>
        </CardHeader>
        <CardContent>
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
        <CardDescription>Connect your wallet to purchase products from the vending machine</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="w-full"
            variant="outline"
          >
            {connector.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
