"use client"

import { useState } from "react"
import { SiteNavigation } from "@/components/site-navigation"
import { NetworkChecker } from "@/components/network-checker"
import { MachineStats } from "@/components/machine-stats"
import { ProductGrid } from "@/components/product-grid"
import { PurchaseModal } from "@/components/purchase-modal"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { usePurchase } from "@/hooks/use-purchase"
import { useAccount } from "wagmi"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

export default function VendingMachinePage() {
  const { isConnected } = useAccount()
  const { tracks, acceptedTokens } = useVendingMachine()
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

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePurchase = (track: Track, token: TokenInfo) => {
    selectTrackAndToken(track, token)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetPurchase()
  }

  const hasAllowance = checkAllowance()

  return (
    <div className="min-h-screen bg-background">
      <SiteNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crypto Vending Machine</h1>
          <p className="text-muted-foreground">
            Purchase snacks and drinks using cryptocurrency. Connect your wallet to get started.
          </p>
        </div>

        <NetworkChecker />

        <div className="space-y-8">
          <MachineStats />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Products</h2>
            <ProductGrid
              tracks={tracks}
              acceptedTokens={acceptedTokens}
              onPurchase={handlePurchase}
              isConnected={isConnected}
            />
          </div>
        </div>

        <PurchaseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          purchaseState={purchaseState}
          hasAllowance={hasAllowance}
          onApprove={approveToken}
          onPurchase={executePurchase}
          isConfirming={isConfirming}
          isConfirmed={isConfirmed}
          isWritePending={isWritePending}
        />
      </main>
    </div>
  )
}
