"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, ExternalLink, X, Clock } from "lucide-react"
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
          description: "Verifying your token approval for the vending machine...",
          variant: "default" as const,
          canDismiss: false,
        }
      case "approving":
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />,
          title: "Requesting Token Approval",
          description:
            "Please approve the token spending in your wallet. This allows the vending machine to deduct the purchase amount.",
          variant: "default" as const,
          canDismiss: false,
        }
      case "purchasing":
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin text-green-500" />,
          title: "Processing Purchase",
          description: "Your purchase is being processed on the blockchain. Please wait for confirmation...",
          variant: "default" as const,
          canDismiss: false,
        }
      case "success":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          title: "Purchase Successful!",
          description: "Your item has been dispensed and vote tokens have been minted to your wallet.",
          variant: "default" as const,
          canDismiss: true,
        }
      case "error":
        return {
          icon: <XCircle className="h-6 w-6 text-red-500" />,
          title: "Purchase Failed",
          description: purchaseState.error || "An error occurred during the purchase. Please try again.",
          variant: "destructive" as const,
          canDismiss: true,
        }
      default:
        return null
    }
  }

  const statusInfo = getStatusInfo()
  if (!statusInfo) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {statusInfo.icon}
              {statusInfo.title}
            </CardTitle>
            {statusInfo.canDismiss && (
              <Button onClick={onDismiss} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={statusInfo.variant}>
            <AlertDescription>{statusInfo.description}</AlertDescription>
          </Alert>

          {/* Transaction Hash */}
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

          {/* Success Details */}
          {purchaseState.step === "success" && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <div className="font-medium">✅ Product dispensed</div>
                <div className="font-medium">🗳️ Vote tokens earned</div>
                <div className="text-xs">You can now participate in governance decisions!</div>
              </div>
            </div>
          )}

          {/* Processing Steps */}
          {!statusInfo.canDismiss && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>This may take a few moments...</span>
            </div>
          )}

          {/* Action Buttons */}
          {statusInfo.canDismiss && (
            <div className="flex gap-2">
              <Button onClick={onDismiss} className="flex-1">
                {purchaseState.step === "success" ? "Continue Shopping" : "Try Again"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
