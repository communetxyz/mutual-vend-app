"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, CreditCard } from "lucide-react"
import { CitizenWalletPayment } from "./citizen-wallet-payment"
import type { VendingTrack, AcceptedToken } from "@/lib/types/vending-machine"

interface ProductGridProps {
  tracks?: VendingTrack[]
  acceptedTokens?: AcceptedToken[]
  onPurchase?: (trackId: number, paymentMethod: "crypto" | "bread") => void
  isLoading?: boolean
}

export function ProductGrid({ tracks = [], acceptedTokens = [], onPurchase, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Coins className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg">No products available</p>
          <p className="text-sm">Check back later for new items</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <Card key={track.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{track.name}</CardTitle>
                <CardDescription>{track.description}</CardDescription>
              </div>
              <Badge variant={track.stock > 0 ? "default" : "secondary"}>
                {track.stock > 0 ? `${track.stock} left` : "Out of stock"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${track.price}</span>
              <span className="text-sm text-gray-500">Track {track.id}</span>
            </div>

            {track.stock > 0 ? (
              <div className="space-y-2">
                <Button onClick={() => onPurchase?.(track.id, "crypto")} className="w-full" variant="default">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Buy with Crypto
                </Button>

                <CitizenWalletPayment
                  amount={track.price}
                  productName={track.name}
                  onSuccess={() => onPurchase?.(track.id, "bread")}
                  className="w-full"
                />
              </div>
            ) : (
              <Button disabled className="w-full">
                Out of Stock
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
