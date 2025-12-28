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
import { Bot, RefreshCw, Package, AlertTriangle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function VendingMachinePage() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-12">
        {/* Header - Bread.coop inspired warm cooperative style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 text-foreground">
              <Bot className="h-10 w-10 text-primary" />
              Mutual Vend Machine
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Purchase snacks with crypto. <span className="text-secondary font-medium">Solidarity in every transaction.</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 border-2">
              <div
                className={`w-2.5 h-2.5 rounded-full animate-pulse ${isCorrectNetwork && connectorOnCorrectNetwork ? "bg-secondary" : "bg-destructive"}`}
              />
              <span className="font-medium">{isCorrectNetwork && connectorOnCorrectNetwork ? "Gnosis Chain" : `Wrong Network`}</span>
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="border-2">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-8 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
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
          <div className="text-center py-16">
            <RefreshCw className="h-10 w-10 mx-auto text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-lg">Loading vending machine data from Gnosis Chain...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && isCorrectNetwork && connectorOnCorrectNetwork && !error && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Package className="h-7 w-7 text-secondary" />
                Available Products
              </h2>
              <Badge className="bg-secondary text-secondary-foreground px-4 py-1">
                {tracks.length} {tracks.length === 1 ? "product" : "products"}
              </Badge>
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
          <div className="text-center py-16">
            <AlertTriangle className="h-14 w-14 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-3">Network Configuration Issue</h3>
            <p className="text-muted-foreground mb-6 text-lg">
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

      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-border bg-muted/30">
        <p className="text-sm text-muted-foreground">&copy; 2025 Mutual Vend. <span className="text-secondary">Solidarity forever.</span></p>
      </footer>
    </div>
  )
}
