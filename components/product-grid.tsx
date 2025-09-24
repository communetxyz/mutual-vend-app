"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatEther } from "viem"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { PurchaseModal } from "./purchase-modal"
import type { Track } from "@/lib/types/vending-machine"

export function ProductGrid() {
  const { tracks, isLoading, error } = useVendingMachine()
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-48 bg-gray-200 rounded-md"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
            <CardFooter>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tracks.map((track) => (
          <Card key={track.trackId} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="aspect-square relative">
                <img
                  src={track.product.imageURI || "/placeholder.svg"}
                  alt={track.product.name}
                  className="w-full h-full object-cover"
                />
                {Number(track.stock) === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{track.product.name}</CardTitle>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">{formatEther(track.price)} ETH</span>
                <Badge variant="outline">Stock: {track.stock.toString()}</Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" onClick={() => setSelectedTrack(track)} disabled={Number(track.stock) === 0}>
                {Number(track.stock) === 0 ? "Out of Stock" : "Purchase"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedTrack && (
        <PurchaseModal track={selectedTrack} isOpen={!!selectedTrack} onClose={() => setSelectedTrack(null)} />
      )}
    </>
  )
}
