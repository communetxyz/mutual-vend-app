"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Package, AlertTriangle } from "lucide-react"
import { ethers } from "ethers"
import type { Track, Token } from "@/lib/types"
import { UI_CONFIG } from "@/lib/config"

interface ProductGridProps {
  tracks: Track[]
  paymentToken: Token | null
  isLoading: boolean
  onPurchase: (trackId: number) => void
  purchaseLoading: boolean
  userBalance?: bigint
}

export function ProductGrid({
  tracks,
  paymentToken,
  isLoading,
  onPurchase,
  purchaseLoading,
  userBalance,
}: ProductGridProps) {
  const formatPrice = (price: bigint, decimals: number) => {
    const formatted = ethers.formatUnits(price, decimals)
    return Number.parseFloat(formatted).toFixed(UI_CONFIG.priceDisplayDecimals)
  }

  const canAfford = (price: bigint) => {
    return userBalance ? userBalance >= price : false
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Products Available</h3>
          <p className="text-gray-500 dark:text-gray-400">The vending machine is currently empty. Check back later!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tracks.map((track) => {
        const isOutOfStock = track.stock <= 0
        const isPriceNotSet = track.price <= 0
        const isUnaffordable = paymentToken && !canAfford(track.price)
        const isDisabled = isOutOfStock || isPriceNotSet || purchaseLoading

        return (
          <Card key={track.trackId} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{track.product.name}</span>
                <Badge variant={isOutOfStock ? "destructive" : "default"}>Track {track.trackId}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                {track.product.imageURI ? (
                  <img
                    src={track.product.imageURI || "/placeholder.svg"}
                    alt={track.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.classList.remove("hidden")
                    }}
                  />
                ) : null}
                <div className={`text-gray-400 ${track.product.imageURI ? "hidden" : ""}`}>
                  <Package className="h-16 w-16" />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Price:</span>
                  <div className="text-right">
                    {isPriceNotSet ? (
                      <Badge variant="secondary">Price TBD</Badge>
                    ) : paymentToken ? (
                      <div>
                        <div className="text-lg font-bold">
                          {formatPrice(track.price, paymentToken.decimals)} {paymentToken.symbol}
                        </div>
                        {isUnaffordable && (
                          <div className="text-xs text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Insufficient balance
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline">Loading...</Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Stock:</span>
                  <Badge variant={isOutOfStock ? "destructive" : "default"}>
                    {track.stock.toString()} {track.stock === 1n ? "item" : "items"}
                  </Badge>
                </div>

                {paymentToken && userBalance !== undefined && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Your balance: {formatPrice(userBalance, paymentToken.decimals)} {paymentToken.symbol}
                  </div>
                )}
              </div>

              {/* Purchase Button */}
              <Button
                onClick={() => onPurchase(track.trackId)}
                disabled={isDisabled || isUnaffordable}
                className="w-full"
                variant={isUnaffordable ? "destructive" : "default"}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isOutOfStock
                  ? "Out of Stock"
                  : isPriceNotSet
                    ? "Price Not Set"
                    : isUnaffordable
                      ? "Insufficient Balance"
                      : purchaseLoading
                        ? "Processing..."
                        : "Purchase"}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
