"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Wifi } from "lucide-react"
import { useSwitchChain, useChainId } from "wagmi"
import { gnosis } from "wagmi/chains"

export function NetworkChecker() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const isCorrectNetwork = chainId === gnosis.id

  if (isCorrectNetwork) {
    return null
  }

  const handleSwitchNetwork = () => {
    switchChain({ chainId: gnosis.id })
  }

  return (
    <Alert className="border-yellow-200 dark:border-yellow-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-medium text-yellow-800 dark:text-yellow-200">Wrong Network</p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Please switch to Gnosis Chain to use the vending machine.
          </p>
        </div>
        <Button onClick={handleSwitchNetwork} disabled={isPending} size="sm" className="ml-4">
          <Wifi className="h-4 w-4 mr-2" />
          {isPending ? "Switching..." : "Switch Network"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
