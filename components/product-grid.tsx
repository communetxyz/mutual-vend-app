"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package } from "lucide-react"
import { formatUnits } from "viem"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

interface ProductGridProps {
  tracks: Track[]
  acceptedTokens: TokenInfo[]
  onPurchase: (track: Track, token: TokenInfo) => void
  isConnected: boolean
}

export function ProductGrid({ tracks, acceptedTokens, onPurchase, isConnected }: ProductGridProps) {
  const formatPrice = (price: bigint, token: TokenInfo) => {
    return `${formatUnits(price, token.decimals)} ${token.symbol}`
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Products Available</h3>
        <p className="text-gray-500 dark:text-gray-400">
          The vending machine is currently being stocked. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tracks.map((track) => (
        <Card key={track.trackId} className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
              {track.product.imageURI ? (
                <img
                  src={track.product.imageURI || "/placeholder.svg"}
                  alt={track.product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <CardTitle className="text-lg">{track.product.name}</CardTitle>
            <div className="flex items-center justify-between">
              <Badge variant={track.stock > 0 ? "default" : "secondary"}>
                {track.stock > 0 ? `${track.stock} in stock` : "Out of stock"}
              </Badge>
              <span className="text-sm text-gray-500">Track #{track.trackId}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {acceptedTokens.map((token) => (
              <div key={token.address} className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">{formatPrice(track.price, token)}</p>
                  {isConnected && (
                    <p className="text-gray-500">
                      Balance: {formatUnits(token.balance, token.decimals)} {token.symbol}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => onPurchase(track, token)}
                  disabled={!isConnected || track.stock === 0n || token.balance < track.price}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Buy
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
