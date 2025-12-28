"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, AlertCircle, Package, Coins, ArrowRight } from "lucide-react"
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
      <DialogContent className="sm:max-w-md border-2">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Package className="h-6 w-6 text-primary" />
            Purchase {selectedTrack.product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps - Bread.coop inspired */}
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  currentStep === "needs-approval"
                    ? "bg-primary text-primary-foreground"
                    : hasAllowance
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {hasAllowance ? <CheckCircle className="h-5 w-5" /> : "1"}
              </div>
              <span className="text-xs mt-2 font-medium">Approve</span>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground" />

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  currentStep === "purchasing"
                    ? "bg-primary text-primary-foreground"
                    : currentStep === "ready-to-purchase"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isPurchasing || (isConfirmed && isPurchasing) ? <Clock className="h-5 w-5 animate-spin" /> : "2"}
              </div>
              <span className="text-xs mt-2 font-medium">Purchase</span>
            </div>
          </div>

          <Separator />

          {/* Product Info */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Product:</span>
              <span className="text-sm font-medium">{selectedTrack.product.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Track:</span>
              <span className="text-sm font-medium">#{selectedTrack.trackId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Stock:</span>
              <Badge className={selectedTrack.stock > 0 ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}>{selectedTrack.stock} available</Badge>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Price:</span>
              <span className="text-sm font-mono font-bold text-primary">
                {formatPrice(selectedTrack.price, selectedToken.decimals)} {selectedToken.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Your Balance:</span>
              <span className="text-sm font-mono">
                {formatPrice(selectedToken.balance, selectedToken.decimals)} {selectedToken.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Token Approval:</span>
              <div className="flex items-center gap-2">
                {hasAllowance ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm text-secondary font-medium">Approved</span>
                  </>
                ) : isApproving || (isConfirming && isApproving) ? (
                  <>
                    <Clock className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-sm text-primary font-medium">Approving...</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary font-medium">Required</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Current Step Status */}
          {currentStep === "approving" && (
            <>
              <Separator />
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-sm text-primary font-medium">
                    {isConfirming ? "Confirming approval..." : "Approval transaction sent"}
                  </span>
                </div>
                <p className="text-xs text-primary/80 mt-2">
                  Please wait for the transaction to confirm, then you can purchase.
                </p>
              </div>
            </>
          )}

          {currentStep === "ready-to-purchase" && (
            <>
              <Separator />
              <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm text-secondary font-medium">Ready to purchase!</span>
                </div>
                <p className="text-xs text-secondary/80 mt-2">
                  Token approval confirmed. Click "Purchase" to complete your order.
                </p>
              </div>
            </>
          )}

          {currentStep === "purchasing" && (
            <>
              <Separator />
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-sm text-primary font-medium">
                    {isConfirmed && isPurchasing ? "Purchase confirmed!" : "Processing purchase..."}
                  </span>
                </div>
                <p className="text-xs text-primary/80 mt-2">
                  {isConfirmed && isPurchasing
                    ? "Your snack is being dispensed!"
                    : "Please wait for the transaction to confirm."}
                </p>
              </div>
            </>
          )}

          {/* Transaction Hash */}
          {txHash && (
            <div className="text-xs text-muted-foreground break-all bg-muted p-3 rounded-lg">
              <p className="font-semibold mb-1 text-foreground">Transaction Hash:</p>
              <p className="font-mono">{txHash}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <>
              <Separator />
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive font-medium">Error</span>
                </div>
                <p className="text-xs text-destructive/80 mt-2">{error}</p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isApproving || isPurchasing || isConfirming}
            >
              {isApproving || isPurchasing || isConfirming ? "Processing..." : "Cancel"}
            </Button>

            {currentStep === "needs-approval" && (
              <Button onClick={onApprove} disabled={isApproving} className="flex-1">
                {isApproving ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
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
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Waiting for Approval...
              </Button>
            )}

            {currentStep === "ready-to-purchase" && (
              <Button onClick={onPurchase} disabled={!canPurchase} className="flex-1">
                <Package className="h-4 w-4 mr-2" />
                Purchase Now
              </Button>
            )}

            {currentStep === "purchasing" && (
              <Button disabled className="flex-1">
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                {isConfirmed && isPurchasing ? "Success!" : "Purchasing..."}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
