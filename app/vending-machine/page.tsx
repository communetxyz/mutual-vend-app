"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Package, Coins, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { useAccount, useChainId } from "wagmi"
import { gnosis } from "wagmi/chains"
import { formatUnits } from "viem"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { usePurchase } from "@/hooks/use-purchase"
import { PurchaseModal } from "@/components/purchase-modal"
import { WalletConnect } from "@/components/wallet-connect"
import { NetworkChecker } from "@/components/network-checker"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

export default function VendingMachinePage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  const { tracks, acceptedTokens, loading, error, refetchTracks } = useVendingMachine()
  const {
    purchaseState,
    selectTrackAndToken,
    checkAllowance,
    approveToken,
    executePurchase,
    resetPurchase,
    isConfirming,
    isConfirmed,
    isWritePending,
  } = usePurchase()

  const isOnGnosisChain = chainId === gnosis.id

  const handlePurchaseClick = (track: Track, token: TokenInfo) => {
    setSelectedTrack(track)
    setSelectedToken(token)
    selectTrackAndToken(track, token)
    setIsPurchaseModalOpen(true)
  }

  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false)
    resetPurchase()
    setSelectedTrack(null)
    setSelectedToken(null)
  }

  const hasAllowance = checkAllowance()

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Package className="h-6 w-6" />
                Vending Machine
              </CardTitle>
              <CardDescription>Connect your wallet to interact with the vending machine</CardDescription>
            </CardHeader>
            <CardContent>
              <WalletConnect />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isOnGnosisChain) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <NetworkChecker />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Package className="h-10 w-10" />
            Vending Machine
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Purchase items using accepted tokens on the Gnosis Chain
          </p>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {isOnGnosisChain ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Connected to Gnosis Chain</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">Wrong Network</span>
              </>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span className="text-lg">Loading vending machine data...</span>
          </div>
        )}

        {/* Accepted Tokens */}
        {acceptedTokens.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Accepted Payment Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {acceptedTokens.map((token) => (
                  <Badge key={token.address} variant="outline" className="px-3 py-1">
                    {token.symbol}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tracks Grid */}
        {!loading && tracks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <Card key={track.trackId} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{track.product.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Track #{track.trackId}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product Image */}
                  <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
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

                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Stock:</span>
                    <Badge variant={Number(track.stock) > 0 ? "default" : "destructive"}>
                      {Number(track.stock)} available
                    </Badge>
                  </div>

                  {/* Price and Purchase Options */}
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Price: {formatUnits(track.price, 18)} tokens
                    </div>

                    {Number(track.stock) > 0 ? (
                      <div className="space-y-2">
                        {acceptedTokens.map((token) => (
                          <Button
                            key={token.address}
                            onClick={() => handlePurchaseClick(track, token)}
                            className="w-full"
                            size="sm"
                            disabled={isWritePending}
                          >
                            <Coins className="h-4 w-4 mr-2" />
                            Buy with {token.symbol}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <Button disabled className="w-full" size="sm">
                        Out of Stock
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tracks.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The vending machine is currently empty. Please check back later.
              </p>
              <Button onClick={refetchTracks} variant="outline">
                <Loader2 className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Refresh Button */}
        {!loading && tracks.length > 0 && (
          <div className="text-center mt-8">
            <Button onClick={refetchTracks} variant="outline">
              <Loader2 className="h-4 w-4 mr-2" />
              Refresh Inventory
            </Button>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
        purchaseState={purchaseState}
        hasAllowance={hasAllowance}
        onApprove={approveToken}
        onPurchase={executePurchase}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        isWritePending={isWritePending}
      />
    </div>
  )
}
