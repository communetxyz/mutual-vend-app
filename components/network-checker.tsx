"use client"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle } from "lucide-react"

const GNOSIS_CHAIN_ID = 100

export function NetworkChecker() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected) {
    return null
  }

  const isCorrectNetwork = chainId === GNOSIS_CHAIN_ID

  if (isCorrectNetwork) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Connected to Gnosis Chain
          </CardTitle>
          <CardDescription className="text-green-600">
            You're on the correct network for vending machine transactions
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700">
          <AlertTriangle className="h-5 w-5" />
          Wrong Network
        </CardTitle>
        <CardDescription className="text-yellow-600">
          Please switch to Gnosis Chain to use the vending machine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => switchChain({ chainId: GNOSIS_CHAIN_ID })} disabled={isPending} className="w-full">
          {isPending ? "Switching..." : "Switch to Gnosis Chain"}
        </Button>
      </CardContent>
    </Card>
  )
}
