"use client"

import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { gnosis } from "wagmi/chains"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Wifi } from "lucide-react"

export function NetworkChecker() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const isCorrectNetwork = chainId === gnosis.id
  const isGnosisChain = chainId === gnosis.id

  if (!isConnected) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Wifi className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Wallet Not Connected</p>
              <p className="text-sm text-yellow-700">Please connect your wallet to use the vending machine</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Wrong Network</p>
                <p className="text-sm text-red-700">Please switch to Gnosis Chain to continue</p>
              </div>
            </div>
            <Button onClick={() => switchChain({ chainId: gnosis.id })} disabled={isPending} size="sm">
              {isPending ? "Switching..." : "Switch Network"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Connected to Gnosis Chain</p>
            <p className="text-sm text-green-700">Ready to make purchases</p>
          </div>
          <Badge className="bg-green-100 text-green-800 ml-auto">Chain ID: {chainId}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
