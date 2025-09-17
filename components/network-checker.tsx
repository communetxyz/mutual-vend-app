"use client"

import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { gnosis } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, ExternalLink, Zap } from "lucide-react"
import { toast } from "sonner"

export function NetworkChecker() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected) return null

  const isCorrectNetwork = chainId === gnosis.id

  if (isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle className="h-4 w-4" />
        Connected to Gnosis Chain (Chain ID: {chainId})
      </div>
    )
  }

  const getNetworkName = (id: number) => {
    switch (id) {
      case 1:
        return "Ethereum Mainnet"
      case 11155111:
        return "Sepolia Testnet"
      case 137:
        return "Polygon"
      case 56:
        return "BSC"
      case 42161:
        return "Arbitrum"
      case 10:
        return "Optimism"
      default:
        return `Unknown Network (${id})`
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      toast.info("Switching to Gnosis Chain...")
      await switchChain({ chainId: gnosis.id })
      toast.success("Successfully switched to Gnosis Chain!")
    } catch (error) {
      console.error("Failed to switch network:", error)
      toast.error("Failed to switch network. Please switch manually in your wallet.")
    }
  }

  return (
    <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
          <AlertTriangle className="h-5 w-5" />
          Network Switch Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-red-300 dark:border-red-700">
          <Zap className="h-4 w-4" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            <strong>Action Required:</strong> Your wallet is connected to {getNetworkName(chainId)}. The vending machine
            only works on Gnosis Chain.
          </AlertDescription>
        </Alert>

        <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Current Network:</span>
            <span className="text-red-600 dark:text-red-400">
              {getNetworkName(chainId)} (ID: {chainId})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Required Network:</span>
            <span className="text-green-600 dark:text-green-400">Gnosis Chain (ID: 100)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Contract Address:</span>
            <span className="font-mono text-xs">0xbde69...FDBC33</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleSwitchNetwork} disabled={isPending} className="w-full">
            {isPending ? "Switching Networks..." : "Switch to Gnosis Chain"}
          </Button>

          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p className="mb-2">If automatic switching fails, manually add Gnosis Chain:</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-xs space-y-1">
              <div>Network Name: Gnosis</div>
              <div>RPC URL: https://rpc.gnosischain.com</div>
              <div>Chain ID: 100</div>
              <div>Currency Symbol: XDAI</div>
              <div>Block Explorer: https://gnosisscan.io</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
              <a href="https://chainlist.org/chain/100" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Chainlist
              </a>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
              <a href="https://gnosisscan.io" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Explorer
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
