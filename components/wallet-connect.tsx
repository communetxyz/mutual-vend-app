"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Wallet, AlertTriangle, Loader2, CheckCircle, ExternalLink } from "lucide-react"
import { useWallet } from "@/lib/hooks/use-wallet"

export function WalletConnect() {
  const {
    isConnected,
    address,
    isCorrectNetwork,
    isConnecting,
    isSwitching,
    error,
    connectWallet,
    switchNetwork,
    disconnectWallet,
  } = useWallet()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && isCorrectNetwork) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Connected to Gnosis Chain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Address:</span>
              <Badge variant="outline" className="font-mono">
                {formatAddress(address!)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Network:</span>
              <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                Gnosis Chain
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Chain ID:</span>
              <Badge variant="outline">100</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://gnosisscan.io/address/${address}`, "_blank")}
              className="flex-1"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View on Gnosisscan
            </Button>
            <Button onClick={disconnectWallet} variant="outline" size="sm" className="flex-1 bg-transparent">
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isConnected && !isCorrectNetwork) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Wrong Network
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Address:</span>
              <Badge variant="outline" className="font-mono">
                {formatAddress(address!)}
              </Badge>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please switch to Gnosis Chain (Chain ID: 100) to use the vending machine. This application only works on
              Gnosis Chain.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={switchNetwork} disabled={isSwitching} className="flex-1">
              {isSwitching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Switching...
                </>
              ) : (
                "Switch to Gnosis Chain"
              )}
            </Button>
            <Button onClick={disconnectWallet} variant="outline" className="flex-1 bg-transparent">
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <Wallet className="h-8 w-8" />
        </div>
        <CardTitle>Connect to Gnosis Chain</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Connect your wallet to Gnosis Chain to purchase items from the vending machine and earn vote tokens.
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={connectWallet} disabled={isConnecting} className="w-full">
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect MetaMask
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
          <div>Requires MetaMask or compatible wallet</div>
          <div>Network: Gnosis Chain (Chain ID: 100)</div>
          <div>Native Currency: xDAI</div>
          <div>
            Explorer:{" "}
            <a
              href="https://gnosisscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Gnosisscan.io
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
