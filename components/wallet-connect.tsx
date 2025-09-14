"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { useWallet } from "@/lib/hooks/use-wallet"

export function WalletConnect() {
  const { isConnected, address, isCorrectNetwork, connectWallet, disconnectWallet, switchNetwork } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setError(null)
      await connectWallet()
    } catch (err: any) {
      console.error("Connection error:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      setIsSwitching(true)
      setError(null)

      await switchNetwork()

      // Give MetaMask time to switch networks
      setTimeout(() => {
        setIsSwitching(false)
      }, 2000)
    } catch (err: any) {
      console.error("Network switch error:", err)
      setError(err.message || "Failed to switch network")
      setIsSwitching(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Wallet className="h-8 w-8" />
          </div>
          <CardTitle>Connect Your Wallet</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connect your wallet to start purchasing from the vending machine
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect MetaMask"
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Address:</span>
            <Badge variant="outline">{formatAddress(address!)}</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Network:</span>
            {isCorrectNetwork ? (
              <Badge variant="default">Gnosis Chain</Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Wrong Network
              </Badge>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSwitching && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Switching to Gnosis Chain... Please check your MetaMask for any prompts.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {!isCorrectNetwork && (
            <Button
              onClick={handleSwitchNetwork}
              disabled={isSwitching}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              {isSwitching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Switching...
                </>
              ) : (
                "Switch to Gnosis"
              )}
            </Button>
          )}
          <Button onClick={disconnectWallet} variant="outline" className="flex-1 bg-transparent">
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
