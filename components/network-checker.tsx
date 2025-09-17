"use client"

import { useChainId, useSwitchChain } from "wagmi"
import { gnosis } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Network } from "lucide-react"

export function NetworkChecker() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const isCorrectNetwork = chainId === gnosis.id

  if (isCorrectNetwork) {
    return null
  }

  return (
    <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <AlertTriangle className="h-5 w-5" />
          Wrong Network
        </CardTitle>
        <CardDescription className="text-yellow-700 dark:text-yellow-300">
          Please switch to Gnosis Chain to use the vending machine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => switchChain({ chainId: gnosis.id })} disabled={isPending} className="w-full">
          <Network className="h-4 w-4 mr-2" />
          {isPending ? "Switching..." : "Switch to Gnosis Chain"}
        </Button>
      </CardContent>
    </Card>
  )
}
