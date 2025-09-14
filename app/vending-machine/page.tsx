"use client"

import { useState } from "react"
import { WalletConnect } from "@/components/wallet-connect"
import { ProductGrid } from "@/components/product-grid"
import { TokenBalance } from "@/components/token-balance"
import { PurchaseStatus } from "@/components/purchase-status"
import { PurchaseConfirmationModal } from "@/components/purchase-confirmation-modal"
import { TransactionHistory } from "@/components/transaction-history"
import { NetworkStatus } from "@/components/network-status"
import { ErrorBoundary } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, AlertTriangle, ExternalLink, Info, CheckCircle } from "lucide-react"
import { useWallet } from "@/lib/hooks/use-wallet"
import { useVendingMachine } from "@/lib/hooks/use-vending-machine"
import { useAppState } from "@/lib/hooks/use-app-state"
import { VENDING_MACHINE_ADDRESS, NETWORK_NAME, CHAIN_ID } from "@/lib/config"
import type { Track } from "@/lib/types"

export default function VendingMachinePage() {
  const { isConnected, address, chainId, isCorrectNetwork, walletService } = useWallet()
  const {
    tracks,
    paymentToken,
    voteTokenAddress,
    isLoading,
    error,
    contractExists,
    purchaseState,
    recentTransactions,
    purchaseFromTrack,
    refreshTokenBalance,
    refreshData,
    dismissPurchaseState,
  } = useVendingMachine(walletService, address)

  const { appState, selectTrack, updateView } = useAppState()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setIsRefreshing(false)
  }

  const handleProductSelect = (trackId: number) => {
    const track = tracks.find((t) => t.trackId === trackId)
    if (track) {
      setSelectedTrack(track)
      setShowConfirmation(true)
      selectTrack(trackId)
    }
  }

  const handlePurchaseConfirm = async () => {
    if (!selectedTrack) return

    setShowConfirmation(false)
    updateView("purchasing")

    try {
      await purchaseFromTrack(selectedTrack.trackId)
      updateView("transaction-complete")
    } catch (error) {
      console.error("Purchase failed:", error)
      updateView("browsing")
    }
  }

  const handlePurchaseCancel = () => {
    setShowConfirmation(false)
    setSelectedTrack(null)
    selectTrack(null)
    updateView("browsing")
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mutual Vend Machine
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Purchase snacks with crypto and earn vote tokens! Connect your wallet to Gnosis Chain to get started.
            </p>
            <div className="mt-4 space-y-1">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                Contract: {VENDING_MACHINE_ADDRESS}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Network: {NETWORK_NAME} (Chain ID: {CHAIN_ID})
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Explorer:{" "}
                <a
                  href="https://gnosisscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Gnosisscan.io
                </a>
              </div>
            </div>
          </div>

          {!isConnected ? (
            <div className="max-w-md mx-auto">
              <WalletConnect />
            </div>
          ) : !isCorrectNetwork ? (
            <div className="max-w-md mx-auto">
              <WalletConnect />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Contract Status Alerts */}
              {contractExists === false && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-medium">Contract Not Found on Gnosis Chain</div>
                      <div>
                        No vending machine contract found at{" "}
                        <code className="bg-gray-100 px-1 rounded">{VENDING_MACHINE_ADDRESS}</code> on Gnosis Chain.
                      </div>
                      <div className="text-sm">
                        Please check the contract address or deploy a new vending machine contract to Gnosis Chain.
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(`https://gnosisscan.io/address/${VENDING_MACHINE_ADDRESS}`, "_blank")
                          }
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Check on Gnosisscan
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {contractExists === true && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-medium">✅ Vending Machine Ready on Gnosis Chain</div>
                      <div>Successfully connected to vending machine contract on Gnosis Chain.</div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        You can now browse products and make purchases with xDAI or accepted tokens!
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {error && contractExists !== false && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-medium">Gnosis Chain Contract Error</div>
                      <div>{error}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(`https://gnosisscan.io/address/${VENDING_MACHINE_ADDRESS}`, "_blank")
                          }
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View on Gnosisscan
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Main Content */}
              <div className="grid gap-8 lg:grid-cols-4">
                {/* Products Section */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Header with refresh */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">Available Products</h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {contractExists === false
                          ? "Contract not found on Gnosis Chain"
                          : contractExists === true
                            ? `${tracks.length} products available`
                            : "Loading products from Gnosis Chain..."}
                      </p>
                    </div>
                    <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>

                  {/* Product Grid */}
                  <ProductGrid
                    tracks={tracks}
                    paymentToken={paymentToken}
                    isLoading={isLoading}
                    onPurchase={handleProductSelect}
                    purchaseLoading={purchaseState.isLoading}
                    userBalance={paymentToken?.balance}
                  />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Token Balance */}
                  <TokenBalance
                    paymentToken={paymentToken}
                    voteTokenAddress={voteTokenAddress}
                    onRefresh={refreshTokenBalance}
                    isRefreshing={isRefreshing}
                  />

                  {/* Network Status */}
                  <NetworkStatus isConnected={isConnected} chainId={chainId} contractExists={contractExists} />

                  {/* Transaction History */}
                  <TransactionHistory transactions={recentTransactions} />

                  {/* Help Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>How It Works</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="space-y-1">
                        <p>1. 🔗 Connect wallet to Gnosis Chain</p>
                        <p>2. 💰 Ensure you have payment tokens</p>
                        <p>3. 🛒 Select a product to purchase</p>
                        <p>4. ✅ Confirm purchase details</p>
                        <p>5. 📝 Approve token spending if needed</p>
                        <p>6. 🎉 Complete purchase & earn vote tokens!</p>
                      </div>
                      <div className="pt-2 border-t text-xs text-gray-500 dark:text-gray-400">
                        Vote tokens let you participate in governance decisions for the vending machine network on
                        Gnosis Chain.
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Confirmation Modal */}
          {showConfirmation && selectedTrack && paymentToken && (
            <PurchaseConfirmationModal
              track={selectedTrack}
              paymentToken={paymentToken}
              estimatedGas={purchaseState.estimatedGas}
              gasPrice={purchaseState.gasPrice}
              onConfirm={handlePurchaseConfirm}
              onCancel={handlePurchaseCancel}
              isLoading={purchaseState.isLoading}
            />
          )}

          {/* Purchase Status Modal */}
          <PurchaseStatus purchaseState={purchaseState} onDismiss={dismissPurchaseState} />
        </div>
      </div>
    </ErrorBoundary>
  )
}
