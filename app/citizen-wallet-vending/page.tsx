"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CitizenWalletPurchase } from "@/components/citizen-wallet-purchase"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { SiteNavigation } from "@/components/site-navigation"
import { RefreshCw, Package, CheckCircle, AlertCircle, Wallet, ExternalLink } from "lucide-react"
import { toast } from "sonner"

export default function CitizenWalletVendingPage() {
  const searchParams = useSearchParams()
  const { tracks, acceptedTokens, machineInfo, voteTokenAddress, loading, error, refetchTracks } = useVendingMachine()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Check for purchase success from URL params
  useEffect(() => {
    const purchaseSuccess = searchParams.get("purchase_success")
    const trackId = searchParams.get("track_id")

    if (purchaseSuccess === "true" && trackId) {
      setShowSuccessMessage(true)
      toast.success(`Purchase successful! Your item from track #${trackId} should be dispensed.`)

      // Refresh inventory after successful purchase
      setTimeout(() => {
        refetchTracks()
      }, 2000)

      // Hide success message after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 10000)
    }
  }, [searchParams, refetchTracks])

  const handleRefresh = () => {
    refetchTracks()
    toast.success("Inventory data refreshed")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
              <Wallet className="h-8 w-8 text-blue-600" />
              Citizen Wallet Vending
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Purchase snacks with BREAD tokens using gasless Citizen Wallet payments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Citizen Wallet Ready
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <Alert className="mb-8 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              <strong>Purchase Successful!</strong> Your item should be dispensed shortly. Thank you for using Citizen
              Wallet!
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

        {/* Citizen Wallet Info */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Pay with Citizen Wallet</h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Use your BREAD tokens for gasless, instant payments. No transaction fees, no waiting for
                  confirmations!
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Gasless transactions</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Instant payments</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>BREAD token rewards</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Mobile-first experience</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-900/50" asChild>
                  <a href="https://citizenwallet.xyz" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Citizen Wallet
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-900/50" asChild>
                  <a href="https://breadchain.xyz" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn about BREAD
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading vending machine data...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
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

            <CitizenWalletPurchase tracks={tracks} />
          </div>
        )}

        {/* Machine Stats */}
        {!loading && !error && tracks.length > 0 && (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">Total Products</span>
              </div>
              <div className="text-2xl font-bold">{tracks.length}</div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">In Stock</span>
              </div>
              <div className="text-2xl font-bold">{tracks.filter((track) => track.stock > 0).length}</div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Payment Method</span>
              </div>
              <div className="text-lg font-bold text-blue-600">BREAD Tokens</div>
            </div>
          </div>
        )}
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Mutual Vend. All rights reserved.</p>
        <div className="sm:ml-auto flex gap-4 text-xs">
          <a
            href="https://citizenwallet.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4"
          >
            Powered by Citizen Wallet
          </a>
          <a
            href="https://breadchain.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4"
          >
            BREAD Community
          </a>
        </div>
      </footer>
    </div>
  )
}
