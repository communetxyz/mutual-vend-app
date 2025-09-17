"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId, useConnectorClient } from "wagmi"
import { gnosis } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WalletConnect } from "@/components/wallet-connect"
import { ProductGrid } from "@/components/product-grid"
import { PurchaseModal } from "@/components/purchase-modal"
import { NetworkChecker } from "@/components/network-checker"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { usePurchase } from "@/hooks/use-purchase"
import { SiteNavigation } from "@/components/site-navigation"
import { Bot, RefreshCw, Package, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

export default function VendingMachinePage() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const searchParams = useSearchParams()
  const { data: connectorClient } = useConnectorClient()
  const { tracks, acceptedTokens, machineInfo, voteTokenAddress, loading, error, refetchTracks } = useVendingMachine()
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
    connectorChainId,
  } = usePurchase()

  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const isCorrectNetwork = chainId === gnosis.id
  const connectorOnCorrectNetwork = connectorChainId === gnosis.id

  // Check for payment success from Citizen Wallet
  useEffect(() => {
    const paymentStatus = searchParams.get("payment")
    if (paymentStatus === "success") {
      toast.success("BREAD payment completed successfully!")
      // Refresh inventory after successful payment
      refetchTracks()
    }
  }, [searchParams, refetchTracks])

  const handlePurchase = (track: any, token: any) => {
    if (!isCorrectNetwork || !connectorOnCorrectNetwork) {
      toast.error("Please ensure your wallet is connected to Gnosis Chain")
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
    toast.success("Inventory data refreshed")
  }

  // Only auto-close modal after successful purchase (not approval)
  useEffect(() => {
    if (isConfirmed && purchaseState.isPurchasing && purchaseState.txHash) {
      console.log("Purchase confirmed, will close modal in 3 seconds...")
      setTimeout(() => {
        handleClosePurchaseModal()
        refetchTracks()
        toast.success("Purchase complete! Your snack has been dispensed!")
      }, 3000)
    }
  }, [isConfirmed, purchaseState.isPurchasing, purchaseState.txHash])

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
              Purchase snacks with crypto or BREAD tokens and earn rewards on Gnosis Chain
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${isCorrectNetwork && connectorOnCorrectNetwork ? "bg-green-500" : "bg-red-500"}`}
              />
              {isCorrectNetwork && connectorOnCorrectNetwork ? "Gnosis Chain" : `Wrong Network`}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Payment Success Alert */}
        {searchParams.get("payment") === "success" && (
          <Alert className="mb-8 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Your BREAD payment was processed successfully! Your item should be dispensed shortly.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="mb-8 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Network Warning */}
        {isConnected && (!isCorrectNetwork || !connectorOnCorrectNetwork) && (
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

        {/* Loading State */}
        {loading && isCorrectNetwork && connectorOnCorrectNetwork && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading vending machine data from Gnosis Chain...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && isCorrectNetwork && connectorOnCorrectNetwork && !error && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6" />
                Available Products
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {tracks.length} {tracks.length === 1 ? "product" : "products"}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  BREAD Payments Available
                </Badge>
              </div>
            </div>

            <ProductGrid
              tracks={tracks}
              acceptedTokens={acceptedTokens}
              onPurchase={handlePurchase}
              isConnected={isConnected && isCorrectNetwork && connectorOnCorrectNetwork}
            />
          </div>
        )}

        {/* Wrong Network Message */}
        {isConnected && (!isCorrectNetwork || !connectorOnCorrectNetwork) && !loading && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Network Configuration Issue</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Your wallet needs to be properly connected to Gnosis Chain to view and purchase products.
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
