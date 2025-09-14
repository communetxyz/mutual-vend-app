"use client"

import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { gnosis } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle } from "lucide-react"

export function NetworkChecker() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  if (!isConnected) return null

  const isCorrectNetwork = chainId === gnosis.id

  if (isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle className="h-4 w-4" />
        Connected to Gnosis Chain
      </div>
    )
  }

  return (
    <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <AlertTriangle className="h-5 w-5" />
          Wrong Network
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          You're connected to the wrong network. Please switch to Gnosis Chain to use the vending machine.
        </p>
        <div className="flex items-center justify-between text-xs">
          <span>Current: {chainId === 1 ? "Ethereum" : chainId === 11155111 ? "Sepolia" : `Chain ${chainId}`}</span>
          <span>Required: Gnosis Chain (100)</span>
        </div>
        <Button onClick={() => switchChain({ chainId: gnosis.id })} className="w-full" size="sm">
          Switch to Gnosis Chain
        </Button>
      </CardContent>
    </Card>
  )
}
