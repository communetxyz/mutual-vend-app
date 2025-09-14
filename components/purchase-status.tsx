"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react"
import type { PurchaseState } from "@/lib/types"

interface PurchaseStatusProps {
  purchaseState: PurchaseState
  onDismiss: () => void
}

export function PurchaseStatus({ purchaseState, onDismiss }: PurchaseStatusProps) {
  if (purchaseState.step === "idle") return null

  const getStatusInfo = () => {
    switch (purchaseState.step) {
      case "checking-allowance":
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin text-blue-500" />,
          title: "Checking Token Allowance",
          description: "Verifying your token approval...",
          variant: "default" as const,
        }
      case "approving":
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />,
          title: "Requesting Token Approval",
          description: "Please approve the token spending in your wallet...",
          variant: "default" as const,
        }
      case "purchasing":
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin text-green-500" />,
          title: "Processing Purchase",
          description: "Your purchase is being processed on the blockchain...",
          variant: "default" as const,
        }
      case "success":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          title: "Purchase Successful!",
          description: "Your item has been dispensed and vote tokens have been minted.",
          variant: "default" as const,
        }
      case "error":
        return {
          icon: <XCircle className="h-6 w-6 text-red-500" />,
          title: "Purchase Failed",
          description: purchaseState.error || "An error occurred during the purchase.",
          variant: "destructive" as const,
        }
      default:
        return null
    }
  }

  const statusInfo = getStatusInfo()
  if (!statusInfo) return null

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          {statusInfo.icon}
          {statusInfo.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{statusInfo.description}</p>

        {purchaseState.txHash && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Transaction:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {purchaseState.txHash.slice(0, 10)}...{purchaseState.txHash.slice(-8)}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              onClick={() => window.open(`https://gnosisscan.io/tx/${purchaseState.txHash}`, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Gnosisscan
            </Button>
          </div>
        )}

        {(purchaseState.step === "success" || purchaseState.step === "error") && (
          <Button onClick={onDismiss} className="w-full">
            Dismiss
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
