"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, AlertTriangle } from "lucide-react"
import { formatUnits } from "viem"
import { useChainId } from "wagmi"
import { gnosis } from "wagmi/chains"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

interface ProductGridProps {
  tracks: Track[]
  acceptedTokens: TokenInfo[]
  onPurchase: (track: Track, token: TokenInfo) => void
  isConnected: boolean
}

export function ProductGrid({ tracks, acceptedTokens, onPurchase, isConnected }: ProductGridProps) {
  const chainId = useChainId()
  const isCorrectNetwork = chainId === gnosis.id

  const formatPrice = (price: bigint, token: TokenInfo) => {
    return `${formatUnits(price, token.decimals)} ${token.symbol}`
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No Products Available</h3>
        <p className="text-muted-foreground text-lg">
          The vending machine is currently being stocked. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tracks.map((track) => (
        <Card key={track.trackId} className="overflow-hidden border-2 border-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="pb-4">
            <div className="aspect-square bg-muted rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {track.product.imageURI ? (
                <img
                  src={track.product.imageURI || "/placeholder.svg"}
                  alt={track.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-14 w-14 text-muted-foreground" />
              )}
            </div>
            <CardTitle className="text-lg font-bold">{track.product.name}</CardTitle>
            <div className="flex items-center justify-between">
              <Badge className={track.stock > 0 ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}>
                {track.stock > 0 ? `${track.stock} in stock` : "Out of stock"}
              </Badge>
              <span className="text-sm text-muted-foreground font-medium">Track #{track.trackId}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isCorrectNetwork && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                <AlertTriangle className="h-4 w-4" />
                Switch to Gnosis Chain
              </div>
            )}
            {acceptedTokens.map((token) => (
              <div key={token.address} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="text-sm">
                  <p className="font-bold text-foreground">{formatPrice(track.price, token)}</p>
                  {isConnected && (
                    <p className="text-muted-foreground">
                      Balance: {formatUnits(token.balance, token.decimals)} {token.symbol}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => onPurchase(track, token)}
                  disabled={!isConnected || !isCorrectNetwork || track.stock === 0n || token.balance < track.price}
                  className="font-semibold"
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
