"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, AlertCircle, ExternalLink, Package } from "lucide-react"
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
}: PurchaseModalProps) {
  const { selectedTrack, selectedToken, isApproving, isPurchasing, txHash, error } = purchaseState

  if (!selectedTrack || !selectedToken) return null

  const formatPrice = (price: bigint, decimals: number) => {
    return formatUnits(price, decimals)
  }

  const getStepStatus = (step: "approve" | "purchase") => {
    if (step === "approve") {
      if (hasAllowance) return "completed"
      if (isApproving) return "loading"
      return "pending"
    } else {
      if (isConfirmed && isPurchasing) return "completed"
      if (isPurchasing) return "loading"
      if (!hasAllowance) return "disabled"
      return "pending"
    }
  }

  const StepIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "loading":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
      case "disabled":
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Purchase {selectedTrack.product.name}
          </DialogTitle>
          <DialogDescription>Complete the transaction to purchase your item</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
              <h3 className="font-medium">{selectedTrack.product.name}</h3>
              <p className="text-sm text-gray-500">Track #{selectedTrack.trackId}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatPrice(selectedTrack.price, selectedToken.decimals)} {selectedToken.symbol}
              </p>
              <Badge variant="secondary" className="text-xs">
                {selectedTrack.stock.toString()} in stock
              </Badge>
            </div>
          </div>

          {/* Transaction Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <StepIcon status={getStepStatus("approve")} />
              <div className="flex-1">
                <p className="font-medium">Approve Token Spending</p>
                <p className="text-sm text-gray-500">Allow the vending machine to spend your {selectedToken.symbol}</p>
              </div>
              {!hasAllowance && (
                <Button onClick={onApprove} disabled={isApproving} size="sm">
                  {isApproving ? "Approving..." : "Approve"}
                </Button>
              )}
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <StepIcon status={getStepStatus("purchase")} />
              <div className="flex-1">
                <p className="font-medium">Complete Purchase</p>
                <p className="text-sm text-gray-500">Execute the purchase transaction</p>
              </div>
              {hasAllowance && (
                <Button onClick={onPurchase} disabled={isPurchasing || !hasAllowance} size="sm">
                  {isPurchasing ? "Purchasing..." : "Purchase"}
                </Button>
              )}
            </div>
          </div>

          {/* Transaction Hash */}
          {txHash && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  {isConfirming ? "Confirming Transaction..." : "Transaction Submitted"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://gnosisscan.io/tx/${txHash}`, "_blank")}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isConfirmed && isPurchasing && (
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Purchase Successful!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Your item will be dispensed shortly.</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Transaction Failed</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              {isConfirmed && isPurchasing ? "Close" : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
