"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Coins, CreditCard, Package } from "lucide-react"
import { formatUnits } from "viem"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

interface PurchaseState {
  selectedTrack: Track | null
  selectedToken: TokenInfo | null
  isApproving: boolean
  isPurchasing: boolean
  txHash: string | null
  error: string | null
}

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
  const { selectedTrack, selectedToken, isApproving, isPurchasing, error } = purchaseState

  if (!selectedTrack || !selectedToken) return null

  const formattedPrice = formatUnits(selectedTrack.price, selectedToken.decimals)

  const getStepStatus = (step: "approve" | "purchase") => {
    if (step === "approve") {
      if (hasAllowance) return "completed"
      if (isApproving || (isConfirming && !isPurchasing)) return "loading"
      return "pending"
    } else {
      if (isConfirmed && isPurchasing) return "completed"
      if (isPurchasing || (isConfirming && isPurchasing)) return "loading"
      if (!hasAllowance) return "disabled"
      return "pending"
    }
  }

  const StepIndicator = ({ status }: { status: "pending" | "loading" | "completed" | "disabled" }) => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disabled":
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-blue-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Purchase {selectedTrack.product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{selectedTrack.product.name}</h3>
              <p className="text-sm text-gray-500">Track #{selectedTrack.trackId}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {formattedPrice} {selectedToken.symbol}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {Number(selectedTrack.stock)} in stock
                </Badge>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {/* Purchase Steps */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Purchase Steps</h4>

            {/* Step 1: Approve */}
            <div className="flex items-center gap-3">
              <StepIndicator status={getStepStatus("approve")} />
              <div className="flex-1">
                <p className="text-sm font-medium">1. Approve {selectedToken.symbol} spending</p>
                <p className="text-xs text-gray-500">Allow the vending machine to spend your {selectedToken.symbol}</p>
              </div>
              {!hasAllowance && (
                <Button size="sm" onClick={onApprove} disabled={isApproving || isWritePending} className="ml-auto">
                  {isApproving || (isConfirming && !isPurchasing) ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    "Approve"
                  )}
                </Button>
              )}
            </div>

            {/* Step 2: Purchase */}
            <div className="flex items-center gap-3">
              <StepIndicator status={getStepStatus("purchase")} />
              <div className="flex-1">
                <p className="text-sm font-medium">2. Complete purchase</p>
                <p className="text-xs text-gray-500">Execute the purchase transaction</p>
              </div>
              {hasAllowance && (
                <Button
                  size="sm"
                  onClick={onPurchase}
                  disabled={isPurchasing || isWritePending || !hasAllowance}
                  className="ml-auto"
                >
                  {isPurchasing || (isConfirming && isPurchasing) ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Purchasing...
                    </>
                  ) : (
                    <>
                      <Coins className="h-3 w-3 mr-1" />
                      Purchase
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Success Message */}
          {isConfirmed && isPurchasing && (
            <Alert className="border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                Purchase successful! Your item will be dispensed shortly.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              {isConfirmed && isPurchasing ? "Close" : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
