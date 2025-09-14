"use client"

import { useState } from "react"
import { WalletConnect } from "@/components/wallet-connect"
import { ProductGrid } from "@/components/product-grid"
import { TokenBalance } from "@/components/token-balance"
import { PurchaseStatus } from "@/components/purchase-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, AlertTriangle, ExternalLink, Info, CheckCircle } from "lucide-react"
import { useWallet } from "@/lib/hooks/use-wallet"
import { useVendingMachine } from "@/lib/hooks/use-vending-machine"
import { VENDING_MACHINE_ADDRESS } from "@/lib/config"

export default function VendingMachinePage() {
  const { isConnected, address, isCorrectNetwork, signer } = useWallet()
  const {
    tracks,
    acceptedTokens,
    voteTokenAddress,
    isLoading,
    error,
    contractExists,
    purchaseState,
    purchaseFromTrack,
    refreshData,
  } = useVendingMachine(signer, address)

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setIsRefreshing(false)
  }

  const handlePurchase = async (trackId: number, tokenAddress: string) => {
    try {
      await purchaseFromTrack(trackId, tokenAddress)
    } catch (error) {
      console.error("Purchase failed:", error)
    }
  }

  const handleDismissStatus = () => {
    // Status will auto-dismiss after timeout, but user can manually dismiss
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Mutual Vend Machine</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Purchase snacks and earn vote tokens! Connect your wallet to Gnosis Chain to get started.
          </p>
          <div className="mt-4 space-y-1">
            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              Contract: {VENDING_MACHINE_ADDRESS}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Network: Gnosis Chain (Chain ID: 100)</div>
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
            {/* Contract Status Alert */}
            {contractExists === false && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Demo Mode - No Contract Deployed</div>
                    <div>
                      No contract is deployed at{" "}
                      <code className="bg-gray-100 px-1 rounded">{VENDING_MACHINE_ADDRESS}</code> on Gnosis Chain.
                    </div>
                    <div className="text-sm">
                      <strong>This is normal!</strong> You're seeing demo data to explore the interface. To use a real
                      vending machine:
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Deploy a vending machine contract to Gnosis Chain</li>
                      <li>Update the contract address in your environment variables</li>
                      <li>Or use an existing deployed contract address</li>
                    </ul>
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

            {/* Contract Found Alert */}
            {contractExists === true && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Contract Found on Gnosis Chain!</div>
                    <div>
                      Successfully connected to vending machine contract at{" "}
                      <code className="bg-gray-100 px-1 rounded">{VENDING_MACHINE_ADDRESS}</code>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && contractExists !== false && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Contract Error</div>
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
                        View Contract on Gnosisscan
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Header with refresh button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Available Products</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {contractExists === false
                    ? "Demo products - try the interface!"
                    : contractExists === true
                      ? "Real products from deployed contract"
                      : "Loading products..."}
                </p>
              </div>
              <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-4">
              {/* Main content - Products */}
              <div className="lg:col-span-3">
                <ProductGrid
                  tracks={tracks}
                  acceptedTokens={acceptedTokens}
                  isLoading={isLoading}
                  onPurchase={handlePurchase}
                  purchaseLoading={purchaseState.isLoading}
                />
              </div>

              {/* Sidebar - Wallet info */}
              <div className="space-y-6">
                <TokenBalance
                  tokens={acceptedTokens}
                  voteTokenAddress={voteTokenAddress}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />

                <Card>
                  <CardHeader>
                    <CardTitle>Contract Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Address:</span>
                      <span className="font-mono text-xs">{VENDING_MACHINE_ADDRESS.slice(0, 10)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network:</span>
                      <span>Gnosis Chain (100)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span
                        className={
                          contractExists === false
                            ? "text-yellow-500"
                            : contractExists === true
                              ? "text-green-500"
                              : "text-gray-500"
                        }
                      >
                        {contractExists === false
                          ? "Demo Mode"
                          : contractExists === true
                            ? "Live Contract"
                            : "Checking..."}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Products:</span>
                      <span>{tracks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tokens:</span>
                      <span>{acceptedTokens.length}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {contractExists === false ? (
                      <>
                        <p>🎮 You're in demo mode!</p>
                        <p>1. Explore the interface</p>
                        <p>2. Deploy a real contract</p>
                        <p>3. Update the contract address</p>
                        <p>4. Start earning real rewards!</p>
                      </>
                    ) : (
                      <>
                        <p>✅ Contract is live!</p>
                        <p>1. Select a product to purchase</p>
                        <p>2. Approve token spending</p>
                        <p>3. Complete your purchase</p>
                        <p>4. Receive vote tokens as rewards!</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Status Overlay */}
        <PurchaseStatus purchaseState={purchaseState} onDismiss={handleDismissStatus} />
      </div>
    </div>
  )
}
