"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Coins, ShoppingCart } from "lucide-react"
import { formatUnits } from "viem"
import { useState } from "react"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"
import { CitizenWalletPayment } from "@/components/citizen-wallet-payment"

interface ProductGridProps {
  tracks: Track[]
  acceptedTokens: TokenInfo[]
  onPurchase: (track: Track, token: TokenInfo) => void
  isConnected: boolean
}

export function ProductGrid({ tracks, acceptedTokens, onPurchase, isConnected }: ProductGridProps) {
  const [selectedTokens, setSelectedTokens] = useState<{ [trackId: number]: string }>({})

  const handleTokenSelect = (trackId: number, tokenAddress: string) => {
    setSelectedTokens((prev) => ({
      ...prev,
      [trackId]: tokenAddress,
    }))
  }

  const handlePurchase = (track: Track) => {
    const selectedTokenAddress = selectedTokens[track.trackId]
    if (!selectedTokenAddress) {
      return
    }

    const selectedToken = acceptedTokens.find((token) => token.address === selectedTokenAddress)
    if (!selectedToken) {
      return
    }

    onPurchase(track, selectedToken)
  }

  const formatPrice = (price: bigint, decimals: number) => {
    return formatUnits(price, decimals)
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Products Available</h3>
        <p className="text-gray-500 dark:text-gray-400">
          The vending machine is currently being restocked. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track) => {
        const selectedTokenAddress = selectedTokens[track.trackId]
        const selectedToken = acceptedTokens.find((token) => token.address === selectedTokenAddress)
        const canPurchase = isConnected && selectedToken && track.stock > 0n

        return (
          <Card key={track.trackId} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{track.product.name}</CardTitle>
                <Badge variant={track.stock > 0 ? "default" : "secondary"}>Track #{track.trackId}</Badge>
              </div>
              <CardDescription>{track.stock > 0 ? `${track.stock} in stock` : "Out of stock"}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>

              {/* Token Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Token</label>
                <Select
                  value={selectedTokenAddress || ""}
                  onValueChange={(value) => handleTokenSelect(track.trackId, value)}
                  disabled={!isConnected || track.stock === 0n}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment token" />
                  </SelectTrigger>
                  <SelectContent>
                    {acceptedTokens.map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4" />
                          <span>{token.symbol}</span>
                          <span className="text-sm text-gray-500">
                            ({formatPrice(track.price, token.decimals)} {token.symbol})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* BREAD Payment Option */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Alternative Payment</label>
                <CitizenWalletPayment
                  productName={track.product.name}
                  amount={formatPrice(track.price, 18)} // BREAD has 18 decimals
                  trackId={track.trackId}
                  disabled={!isConnected || track.stock === 0n}
                  onSuccess={() => {
                    // Handle successful BREAD payment
                    console.log("BREAD payment initiated for track", track.trackId)
                  }}
                />
              </div>

              {/* Price Display */}
              {selectedToken && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm font-medium">Price:</span>
                  <span className="font-bold">
                    {formatPrice(track.price, selectedToken.decimals)} {selectedToken.symbol}
                  </span>
                </div>
              )}

              {/* Purchase Button */}
              <Button onClick={() => handlePurchase(track)} disabled={!canPurchase} className="w-full" size="lg">
                {!isConnected ? (
                  "Connect Wallet"
                ) : track.stock === 0n ? (
                  "Out of Stock"
                ) : !selectedToken ? (
                  "Select Payment Token"
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Purchase Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
