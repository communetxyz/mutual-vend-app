"use client"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { gnosis } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function NetworkChecker() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  if (!isConnected) {
    return null
  }

  if (chainId !== gnosis.id) {
    return (
      <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <span className="text-sm text-yellow-800 dark:text-yellow-200">
          Please switch to Gnosis Chain to use this application
        </span>
        <Button variant="outline" size="sm" onClick={() => switchChain({ chainId: gnosis.id })} className="ml-auto">
          Switch Network
        </Button>
      </div>
    )
  }

  return null
}
