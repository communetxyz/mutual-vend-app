"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, AlertCircle, Package, Coins } from "lucide-react"
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
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-600">Required</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Transaction Status */}
          {(isConfirming || isConfirmed || txHash) && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {isConfirming ? (
                    <>
                      <Clock className="h-4 w-4 text-blue-500 animate-spin" />
                      <span className="text-sm">Transaction confirming...</span>
                    </>
                  ) : isConfirmed ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Transaction confirmed!</span>
                    </>
                  ) : null}
                </div>
                {txHash && (
                  <div className="text-xs text-gray-500 break-all">
                    <p>Transaction: {txHash}</p>
                  </div>
                )}
              </div>
            </>
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
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>

            {!hasAllowance ? (
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
            ) : (
              <Button onClick={onPurchase} disabled={!canPurchase} className="flex-1">
                {isPurchasing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Purchasing...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Purchase
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
