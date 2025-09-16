"use client"

import { useChainId, useSwitchChain } from "wagmi"
import { gnosis } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function NetworkChecker() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  if (chainId === gnosis.id) {
    return null
  }

  return (
    <Alert className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Please switch to Gnosis Chain to use the vending machine.</span>
        <Button size="sm" onClick={() => switchChain({ chainId: gnosis.id })}>
          Switch Network
        </Button>
      </AlertDescription>
    </Alert>
  )
}
