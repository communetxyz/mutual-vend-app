"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId } from "wagmi"
import { gnosis } from "wagmi/chains"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WalletConnect } from "@/components/wallet-connect"
import { ProductGrid } from "@/components/product-grid"
import { PurchaseModal } from "@/components/purchase-modal"
import { NetworkChecker } from "@/components/network-checker"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { usePurchase } from "@/hooks/use-purchase"
import { SiteNavigation } from "@/components/site-navigation"
import { Bot, RefreshCw, Wallet, Package, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function VendingMachinePage() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
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
  const isCorrectNetwork = chainId === gnosis.id

  const handlePurchase = (track: any, token: any) => {
    if (!isCorrectNetwork) {
      toast.error("Please switch to Gnosis Chain first")
      return
    }
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
              Purchase snacks with crypto and earn rewards on Gnosis Chain
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${isCorrectNetwork ? "bg-green-500" : "bg-red-500"}`}
              />
              {isCorrectNetwork ? "Gnosis Chain" : `Wrong Network (${chainId})`}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Network Warning */}
        {isConnected && !isCorrectNetwork && (
          <div className="mb-8">
            <NetworkChecker />
          </div>
        )}

        {/* Wallet Connection */}
        {!isConnected && (
          <div className="flex justify-center mb-8">
            <WalletConnect />
          </div>
        )}

        {/* Connected Wallet Info */}
        {isConnected && isCorrectNetwork && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Your Wallet on Gnosis Chain
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
        {loading && isCorrectNetwork && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading vending machine data from Gnosis Chain...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && isCorrectNetwork && (
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
              isConnected={isConnected && isCorrectNetwork}
            />
          </div>
        )}

        {/* Wrong Network Message */}
        {isConnected && !isCorrectNetwork && !loading && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Wrong Network</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Please switch to Gnosis Chain to view and purchase products.
            </p>
            <NetworkChecker />
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
