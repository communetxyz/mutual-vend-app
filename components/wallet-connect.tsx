"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react"
import { useState } from "react"

export function WalletConnect() {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>Connected via {connector?.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div>
              <p className="font-medium text-green-800">{formatAddress(address)}</p>
              <p className="text-sm text-green-600">Ready to make purchases</p>
            </div>
            <Badge className="bg-green-100 text-green-800">Connected</Badge>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyAddress} className="flex-1 bg-transparent">
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy Address"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://gnosisscan.io/address/${address}`, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={() => disconnect()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>Connect your wallet to start making purchases</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            variant="outline"
            className="w-full justify-start"
          >
            <Wallet className="h-4 w-4 mr-2" />
            {connector.name}
            {isPending && " (Connecting...)"}
          </Button>
        ))}

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="font-medium text-blue-800 mb-1">Supported Wallets:</p>
          <ul className="space-y-1 text-blue-700">
            <li>• MetaMask (Browser Extension)</li>
            <li>• WalletConnect (Mobile Wallets)</li>
            <li>• Coinbase Wallet</li>
            <li>• Other Web3 Wallets</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
