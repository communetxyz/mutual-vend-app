"use client"

import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

const TARGET_CHAIN_ID = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111")
const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME || "Sepolia"

export function NetworkChecker() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected) {
    return null
  }

  if (chainId === TARGET_CHAIN_ID) {
    return null
  }

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-yellow-800">Please switch to {NETWORK_NAME} network to use the vending machine.</span>
        <Button
          onClick={() => switchChain({ chainId: TARGET_CHAIN_ID })}
          disabled={isPending}
          size="sm"
          className="ml-4"
        >
          {isPending ? "Switching..." : `Switch to ${NETWORK_NAME}`}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
