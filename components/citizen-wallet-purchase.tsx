"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { generateReceiveLink } from "@citizenwallet/sdk"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Package, ExternalLink } from "lucide-react"
import { formatUnits } from "viem"
import { getCommunityConfig } from "@/lib/citizen-wallet/config"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import type { Track } from "@/lib/types/vending-machine"
import { toast } from "sonner"

interface CitizenWalletPurchaseProps {
  tracks: Track[]
  isConnected?: boolean
}

export function CitizenWalletPurchase({ tracks, isConnected = false }: CitizenWalletPurchaseProps) {
  const router = useRouter()
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)

  const handlePurchaseWithCitizenWallet = async (track: Track) => {
    try {
      setIsGeneratingLink(true)
      setSelectedTrack(track)

      // Get the current URL for success redirect
      const currentUrl = window.location.origin + window.location.pathname
      const successRedirect = `${currentUrl}?purchase_success=true&track_id=${track.trackId}`

      // Convert price from wei to BREAD tokens (18 decimals)
      const amount = formatUnits(track.price, 18)

      // Generate the Citizen Wallet receive link
      const receiveLink = generateReceiveLink(
        "", // sigAuthRedirect - empty for now, will be populated by the app
        getCommunityConfig(),
        VENDING_MACHINE_ADDRESS, // destination address (vending machine contract)
        Number.parseFloat(amount), // amount in normal notation
        `Purchase: ${track.product.name} from Mutual Vend Machine #${track.trackId}`, // description
      )

      // Add success redirect parameter
      const finalLink = `${receiveLink}&success=${encodeURIComponent(successRedirect)}`

      toast.success("Opening Citizen Wallet...")

      // Redirect to Citizen Wallet
      window.location.href = finalLink
    } catch (error) {
      console.error("Failed to generate Citizen Wallet link:", error)
      toast.error("Failed to open Citizen Wallet. Please try again.")
    } finally {
      setIsGeneratingLink(false)
      setSelectedTrack(null)
    }
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
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
          <Wallet className="h-4 w-4" />
          <span className="font-medium">Citizen Wallet Integration</span>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Pay with BREAD tokens using the Citizen Wallet app. Transactions are gasless and instant!
        </p>
      </div>

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
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">{formatUnits(track.price, 18)} BREAD</p>
                  <p className="text-gray-500 text-xs">Gasless payment via Citizen Wallet</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handlePurchaseWithCitizenWallet(track)}
                  disabled={track.stock === 0n || (isGeneratingLink && selectedTrack?.trackId === track.trackId)}
                  className="flex items-center gap-2"
                >
                  {isGeneratingLink && selectedTrack?.trackId === track.trackId ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Opening...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" />
                      Pay with BREAD
                    </>
                  )}
                </Button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>Opens Citizen Wallet app</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
