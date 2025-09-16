"use client"

import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { gnosis } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function NetworkChecker() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const isCorrectNetwork = chainId === gnosis.id

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: gnosis.id })
      toast.success("Successfully switched to Gnosis Chain!")
    } catch (error) {
      console.error("Failed to switch network:", error)
      toast.error("Failed to switch network. Please try manually in your wallet.")
    }
  }

  if (!isConnected) {
    return null
  }

  if (isCorrectNetwork) {
    return (
      <Card className="border-green-200 dark:border-green-800">
        <CardContent className="flex items-center gap-3 p-4">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <div className="font-medium text-green-700 dark:text-green-300">Connected to Gnosis Chain</div>
            <div className="text-sm text-green-600 dark:text-green-400">Ready to interact with vending machines</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-yellow-200 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
          <AlertTriangle className="h-5 w-5" />
          Wrong Network
        </CardTitle>
        <CardDescription>You need to be connected to Gnosis Chain to use the vending machine.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSwitchNetwork} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Switching...
            </>
          ) : (
            "Switch to Gnosis Chain"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
