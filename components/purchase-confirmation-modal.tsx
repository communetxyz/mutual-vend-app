"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, X, Package, Coins, Clock } from "lucide-react"
import { ethers } from "ethers"
import type { Track, Token } from "@/lib/types"

interface PurchaseConfirmationModalProps {
  track: Track
  paymentToken: Token
  estimatedGas?: bigint
  gasPrice?: bigint
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}

export function PurchaseConfirmationModal({
  track,
  paymentToken,
  estimatedGas,
  gasPrice,
  onConfirm,
  onCancel,
  isLoading,
}: PurchaseConfirmationModalProps) {
  const formatPrice = (price: bigint, decimals: number) => {
    const formatted = ethers.formatUnits(price, decimals)
    return Number.parseFloat(formatted).toFixed(4)
  }

  const formatGasCost = () => {
    if (!estimatedGas || !gasPrice) return "Estimating..."
    const cost = estimatedGas * gasPrice
    return `${ethers.formatEther(cost)} xDAI`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Confirm Purchase
            </CardTitle>
            <Button onClick={onCancel} variant="ghost" size="sm" disabled={isLoading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Details */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                {track.product.imageURI ? (
                  <img
                    src={track.product.imageURI || "/placeholder.svg"}
                    alt={track.product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{track.product.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Track {track.trackId}</div>
              </div>
              <Badge variant="outline">{track.stock.toString()} in stock</Badge>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Item Price:</span>
              <div className="text-right">
                <div className="font-bold">
                  {formatPrice(track.price, paymentToken.decimals)} {paymentToken.symbol}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Estimated Gas:</span>
              <span>{formatGasCost()}</span>
            </div>

            <div className="border-t pt-2">
              <div className="flex justify-between items-center font-medium">
                <span>You'll Pay:</span>
                <span>
                  {formatPrice(track.price, paymentToken.decimals)} {paymentToken.symbol} + gas
                </span>
              </div>
            </div>
          </div>

          {/* Rewards Info */}
          <Alert>
            <Coins className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div className="font-medium">🎉 You'll earn vote tokens!</div>
                <div className="text-sm">
                  Vote tokens will be minted to your wallet, allowing you to participate in governance decisions.
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent" disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Purchase
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            This transaction will be processed on Gnosis Chain
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
