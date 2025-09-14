"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Package } from "lucide-react"
import { ethers } from "ethers"
import type { Track, Token } from "@/lib/types"

interface ProductGridProps {
  tracks: Track[]
  acceptedTokens: Token[]
  isLoading: boolean
  onPurchase: (trackId: number, tokenAddress: string) => void
  purchaseLoading: boolean
}

export function ProductGrid({ tracks, acceptedTokens, isLoading, onPurchase, purchaseLoading }: ProductGridProps) {
  const formatPrice = (price: bigint, decimals: number) => {
    return ethers.formatUnits(price, decimals)
  }

  const getTokenSymbol = () => {
    return acceptedTokens[0]?.symbol || "TOKEN"
  }

  const getTokenDecimals = () => {
    return acceptedTokens[0]?.decimals || 18
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
              <Skeleton className="h-32 w-full" />
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
      {tracks.map((track) => (
        <Card key={track.trackId} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{track.product.name}</span>
              <Badge variant={track.stock > 0 ? "default" : "secondary"}>Track {track.trackId}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              {track.product.imageURI ? (
                <img
                  src={track.product.imageURI || "/placeholder.svg"}
                  alt={track.product.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextElementSibling?.classList.remove("hidden")
                  }}
                />
              ) : null}
              <div className={`text-gray-400 ${track.product.imageURI ? "hidden" : ""}`}>
                <Package className="h-16 w-16" />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Price:</span>
                <span className="text-lg font-bold">
                  {formatPrice(track.price, getTokenDecimals())} {getTokenSymbol()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">Stock:</span>
                <Badge variant={track.stock > 0 ? "default" : "destructive"}>{track.stock.toString()} items</Badge>
              </div>
            </div>

            {/* Purchase Button */}
            <Button
              onClick={() => acceptedTokens[0] && onPurchase(track.trackId, acceptedTokens[0].address)}
              disabled={track.stock === 0n || track.price === 0n || !acceptedTokens[0] || purchaseLoading}
              className="w-full"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {track.stock === 0n
                ? "Out of Stock"
                : track.price === 0n
                  ? "Price Not Set"
                  : purchaseLoading
                    ? "Processing..."
                    : "Purchase"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
