"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, AlertCircle, Package, Coins, ArrowRight, Loader2 } from "lucide-react"
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
  isWritePending?: boolean
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
  isWritePending = false,
}: PurchaseModalProps) {
  const { selectedTrack, selectedToken, isApproving, isPurchasing, txHash, error } = purchaseState

  if (!selectedTrack || !selectedToken) return null

  const formatPrice = (price: bigint, decimals: number) => {
    return formatUnits(price, decimals)
  }

  const canPurchase = hasAllowance && !isApproving && !isPurchasing && selectedToken.balance >= selectedTrack.price

  // Determine current step
  const getCurrentStep = () => {
    if (isPurchasing || (isConfirmed && isPurchasing)) return "purchasing"
    if (isApproving || (isConfirming && isApproving)) return "approving"
    if (hasAllowance) return "ready-to-purchase"
    return "needs-approval"
  }

  const currentStep = getCurrentStep()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Purchase {selectedTrack.product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === "needs-approval"
                    ? "bg-blue-500 text-white"
                    : hasAllowance
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {hasAllowance ? <CheckCircle className="h-4 w-4" /> : "1"}
              </div>
              <span className="text-xs mt-1">Approve</span>
            </div>

            <ArrowRight className="h-4 w-4 text-gray-400" />

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === "purchasing"
                    ? "bg-blue-500 text-white"
                    : currentStep === "ready-to-purchase"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {isPurchasing || (isConfirmed && isPurchasing) ? <Clock className="h-4 w-4 animate-spin" /> : "2"}
              </div>
              <span className="text-xs mt-1">Purchase</span>
            </div>
          </div>

          <Separator />

          {/* Product Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Product:</span>
              <span className="text-sm">{selectedTrack.product.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Track:</span>
              <span className="text-sm">#{selectedTrack.trackId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Stock:</span>
              <Badge variant={selectedTrack.stock > 0 ? "default" : "secondary"}>{selectedTrack.stock} available</Badge>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Price:</span>
              <span className="text-sm font-mono">
                {formatPrice(selectedTrack.price, selectedToken.decimals)} {selectedToken.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Your Balance:</span>
              <span className="text-sm font-mono">
                {formatPrice(selectedToken.balance, selectedToken.decimals)} {selectedToken.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Token Approval:</span>
              <div className="flex items-center gap-2">
                {hasAllowance ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Approved</span>
                  </>
                ) : isApproving || (isConfirming && isApproving) || isWritePending ? (
                  <>
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    <span className="text-sm text-blue-600">Approving...</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-600">Required</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Current Step Status */}
          {currentStep === "approving" && (
            <>
              <Separator />
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {isConfirming ? "Confirming approval..." : "Approval transaction sent"}
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Please wait for the transaction to confirm, then you can purchase.
                </p>
              </div>
            </>
          )}

          {currentStep === "ready-to-purchase" && (
            <>
              <Separator />
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Ready to purchase!</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Token approval confirmed. Click "Purchase" to complete your order.
                </p>
              </div>
            </>
          )}

          {currentStep === "purchasing" && (
            <>
              <Separator />
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {isConfirmed && isPurchasing ? "Purchase confirmed!" : "Processing purchase..."}
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {isConfirmed && isPurchasing
                    ? "Your snack is being dispensed!"
                    : "Please wait for the transaction to confirm."}
                </p>
              </div>
            </>
          )}

          {/* Transaction Hash */}
          {txHash && (
            <div className="text-xs text-gray-500 break-all bg-gray-50 dark:bg-gray-900 p-2 rounded">
              <p className="font-medium mb-1">Transaction Hash:</p>
              <p className="font-mono">{txHash}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <>
              <Separator />
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">Error</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isApproving || isPurchasing || isConfirming || isWritePending}
            >
              {isApproving || isPurchasing || isConfirming || isWritePending ? "Processing..." : "Cancel"}
            </Button>

            {currentStep === "needs-approval" && (
              <Button onClick={onApprove} disabled={isApproving || isWritePending} className="flex-1">
                {isApproving || isWritePending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4 mr-2" />
                    Approve {selectedToken.symbol}
                  </>
                )}
              </Button>
            )}

            {currentStep === "approving" && (
              <Button disabled className="flex-1">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Waiting for Approval...
              </Button>
            )}

            {currentStep === "ready-to-purchase" && (
              <Button onClick={onPurchase} disabled={!canPurchase || isWritePending} className="flex-1">
                {isWritePending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Purchase Now
                  </>
                )}
              </Button>
            )}

            {currentStep === "purchasing" && (
              <Button disabled className="flex-1">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isConfirmed && isPurchasing ? "Success!" : "Purchasing..."}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
