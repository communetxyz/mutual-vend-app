"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { usePurchase } from "@/hooks/use-purchase"
import { PurchaseModal } from "@/components/purchase-modal"
import { formatEther } from "viem"
import { ShoppingCart, Package, AlertCircle } from "lucide-react"
import Image from "next/image"

export function ProductGrid() {
  const { tracks, tokens, isLoading, isCorrectNetwork } = useVendingMachine()
  const { selectTrackAndToken } = usePurchase()
  const [selectedTrack, setSelectedTrack] = useState<any>(null)

  const handlePurchase = async (track: any) => {
    if (!isCorrectNetwork) {
      return
    }

    // For now, default to the first available token (WXDAI)
    const defaultToken = tokens.find((token) => token.balance > track.price)

    if (!defaultToken) {
      alert("Insufficient balance in any supported token")
      return
    }

    await selectTrackAndToken(track, defaultToken)
    setSelectedTrack(track)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Network Required</h3>
          <p className="text-muted-foreground">Please connect to Gnosis Chain to view and purchase products</p>
        </CardContent>
      </Card>
    )
  }

  if (tracks.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Products Available</h3>
          <p className="text-muted-foreground">Check back later for available products</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tracks.map((track) => {
          const isOutOfStock = track.stock === 0n
          const priceInEther = formatEther(track.price)

          return (
            <Card key={track.trackId.toString()} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
                <Image
                  src={`/abstract-geometric-shapes.png?height=200&width=300&query=${encodeURIComponent(track.name)}`}
                  alt={track.name}
                  fill
                  className="object-cover"
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">Stock: {track.stock.toString()}</Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{track.name}</CardTitle>
                <CardDescription>Track #{track.trackId.toString()}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-green-600">{priceInEther} XDAI</div>
                  <div className="text-sm text-muted-foreground">
                    ≈ ${(Number.parseFloat(priceInEther) * 1.0).toFixed(2)} USD
                  </div>
                </div>

                <Button onClick={() => handlePurchase(track)} disabled={isOutOfStock} className="w-full" size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isOutOfStock ? "Out of Stock" : "Purchase"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <PurchaseModal isOpen={!!selectedTrack} onClose={() => setSelectedTrack(null)} track={selectedTrack} />
    </>
  )
}
