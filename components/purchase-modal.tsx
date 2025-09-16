"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, AlertCircle, ExternalLink, Loader2 } from "lucide-react"
import { formatUnits } from "viem"
import type { PurchaseState } from "@/lib/types/vending-machine"

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  purchaseState: PurchaseState
  hasAllowance: boolean
  onApprove: () => void
  onPurchase: () => void
  isConfirming: boolean
  isConfirmed: boolean
  isWritePending: boolean
}

export function PurchaseModal({
  isOpen,
  onClose,
  purchaseState,
  hasAllowance,
  onApprove,
  onPurchase,
  isConfirming,
  isConfirmed,
  isWritePending,
}: PurchaseModalProps) {
  const { selectedTrack, selectedToken, step, error, txHash } = purchaseState

  if (!selectedTrack || !selectedToken) return null

  const price = formatUnits(selectedTrack.price, selectedToken.decimals)
  const balance = formatUnits(selectedToken.balance, selectedToken.decimals)

  const getStepIcon = (stepName: string, currentStep: string, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (stepName === currentStep) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
    return <Clock className="h-5 w-5 text-gray-400" />
  }

  const getStepStatus = (stepName: string, currentStep: string, isCompleted: boolean) => {
    if (isCompleted) return "completed"
    if (stepName === currentStep) return "active"
    return "pending"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase {selectedTrack.product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{selectedTrack.product.name}</h3>
              <p className="text-sm text-gray-500">Track #{selectedTrack.trackId}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{selectedToken.symbol}</Badge>
                <span className="text-sm font-medium">
                  {price} {selectedToken.symbol}
                </span>
              </div>
            </div>
          </div>

          {/* Balance Check */}
          <div className="flex justify-between text-sm">
            <span>Your Balance:</span>
            <span className={selectedToken.balance < selectedTrack.price ? "text-red-500" : "text-green-500"}>
              {balance} {selectedToken.symbol}
            </span>
          </div>

          <Separator />

          {/* Transaction Steps */}
          <div className="space-y-4">
            <h4 className="font-medium">Transaction Steps</h4>

            {/* Step 1: Approval */}
            <div className="flex items-center gap-3">
              {getStepIcon("approving", step, hasAllowance)}
              <div className="flex-1">
                <p className="text-sm font-medium">{hasAllowance ? "Token Approved" : "Approve Token Spending"}</p>
                <p className="text-xs text-gray-500">
                  {hasAllowance ? "Ready to purchase" : "Allow the vending machine to spend your tokens"}
                </p>
              </div>
              {!hasAllowance && (
                <Button size="sm" onClick={onApprove} disabled={step === "approving" || isWritePending}>
                  {step === "approving" ? "Approving..." : "Approve"}
                </Button>
              )}
            </div>

            {/* Step 2: Purchase */}
            <div className="flex items-center gap-3">
              {getStepIcon("purchasing", step, step === "completed")}
              <div className="flex-1">
                <p className="text-sm font-medium">Execute Purchase</p>
                <p className="text-xs text-gray-500">Complete the purchase transaction</p>
              </div>
              <Button
                size="sm"
                onClick={onPurchase}
                disabled={!hasAllowance || step === "purchasing" || isWritePending}
              >
                {step === "purchasing" ? "Purchasing..." : "Purchase"}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {step === "completed" && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Purchase completed successfully!</span>
            </div>
          )}

          {/* Transaction Hash */}
          {txHash && (
            <div className="flex items-center gap-2 text-sm">
              <span>Transaction:</span>
              <a
                href={`https://gnosisscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                View on Explorer
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              {step === "completed" ? "Close" : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
