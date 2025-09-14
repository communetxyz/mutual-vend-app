"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WalletConnect } from "@/components/wallet-connect"
import { ProductGrid } from "@/components/product-grid"
import { PurchaseModal } from "@/components/purchase-modal"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { usePurchase } from "@/hooks/use-purchase"
import { SiteNavigation } from "@/components/site-navigation"
import { Bot, RefreshCw, Wallet, Package } from "lucide-react"
import { NETWORK_NAME } from "@/lib/web3/config"
import { toast } from "sonner"

export default function VendingMachinePage() {
  const { isConnected } = useAccount()
  const { tracks, acceptedTokens, loading, refetchTracks } = useVendingMachine()
  const {
    purchaseState,
    selectTrackAndToken,
    checkAllowance,
    approveToken,
    executePurchase,
    resetPurchase,
    isConfirming,
    isConfirmed,
    refetchAllowance,
  } = usePurchase()

  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const handlePurchase = (track: any, token: any) => {
    selectTrackAndToken(track, token)
    setShowPurchaseModal(true)
    refetchAllowance()
  }

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false)
    resetPurchase()
  }

  const handleRefresh = () => {
    refetchTracks()
    toast.success("Product data refreshed")
  }

  // Auto-close modal and refresh on successful purchase
  useEffect(() => {
    if (isConfirmed && purchaseState.txHash) {
      setTimeout(() => {
        handleClosePurchaseModal()
        refetchTracks()
        toast.success("Purchase successful! Enjoy your snack!")
      }, 2000)
    }
  }, [isConfirmed, purchaseState.txHash])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
              <Bot className="h-8 w-8" />
              Mutual Vend Machine
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Purchase snacks with crypto and earn rewards on {NETWORK_NAME}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {NETWORK_NAME} Network
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Wallet Connection */}
        {!isConnected && (
          <div className="flex justify-center mb-8">
            <WalletConnect />
          </div>
        )}

        {/* Connected Wallet Info */}
        {isConnected && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {acceptedTokens.map((token) => (
                    <div
                      key={token.address}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-gray-500">{token.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm">
                          {(Number(token.balance) / Math.pow(10, token.decimals)).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">{token.symbol}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading vending machine data...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6" />
                Available Products
              </h2>
              <Badge variant="secondary">
                {tracks.length} {tracks.length === 1 ? "product" : "products"}
              </Badge>
            </div>

            <ProductGrid
              tracks={tracks}
              acceptedTokens={acceptedTokens}
              onPurchase={handlePurchase}
              isConnected={isConnected}
            />
          </div>
        )}

        {/* Purchase Modal */}
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={handleClosePurchaseModal}
          purchaseState={purchaseState}
          hasAllowance={checkAllowance()}
          onApprove={approveToken}
          onPurchase={executePurchase}
          isConfirming={isConfirming}
          isConfirmed={isConfirmed}
        />
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Mutual Vend. All rights reserved.</p>
      </footer>
    </div>
  )
}
