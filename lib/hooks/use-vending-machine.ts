"use client"

import { useState, useEffect, useCallback } from "react"
import { UI_CONFIG } from "@/lib/config"
import { ContractService } from "@/lib/services/contract-service"
import { TransactionMonitor } from "@/lib/services/transaction-monitor"
import type { WalletService } from "@/lib/services/wallet-service"
import type { Track, Token, PurchaseState, TransactionStatus } from "@/lib/types"

export function useVendingMachine(walletService: WalletService, userAddress: string | null) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [paymentToken, setPaymentToken] = useState<Token | null>(null)
  const [voteTokenAddress, setVoteTokenAddress] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contractExists, setContractExists] = useState<boolean | null>(null)
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    isLoading: false,
    error: null,
    txHash: null,
    step: "idle",
  })
  const [recentTransactions, setRecentTransactions] = useState<TransactionStatus[]>([])

  const [contractService] = useState(() => new ContractService(walletService))
  const [transactionMonitor] = useState(() => new TransactionMonitor(contractService))

  const loadContractData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if contract exists
      const exists = await contractService.checkContractExists()
      setContractExists(exists)

      if (!exists) {
        setError("Vending machine contract not found at the configured address")
        return
      }

      // Load tracks and payment token in parallel
      const [tracksData, paymentTokenData, voteToken] = await Promise.all([
        contractService.getAllTracks(),
        contractService.getPaymentToken(),
        contractService.getVoteTokenAddress(),
      ])

      setTracks(tracksData)
      setPaymentToken(paymentTokenData)
      setVoteTokenAddress(voteToken)

      // Load token balance if user is connected
      if (userAddress && paymentTokenData) {
        const balance = await contractService.getTokenBalance(paymentTokenData.address, userAddress)
        setPaymentToken((prev) => (prev ? { ...prev, balance } : null))
      }
    } catch (error: any) {
      console.error("Failed to load contract data:", error)
      setError(error.message || "Failed to load vending machine data")
      setContractExists(false)
    } finally {
      setIsLoading(false)
    }
  }, [contractService, userAddress])

  const refreshTokenBalance = useCallback(async () => {
    if (!userAddress || !paymentToken) return

    try {
      const balance = await contractService.getTokenBalance(paymentToken.address, userAddress)
      setPaymentToken((prev) => (prev ? { ...prev, balance } : null))
    } catch (error) {
      console.error("Failed to refresh token balance:", error)
    }
  }, [contractService, userAddress, paymentToken])

  const purchaseFromTrack = useCallback(
    async (trackId: number): Promise<void> => {
      if (!userAddress || !paymentToken) {
        throw new Error("Wallet not connected")
      }

      const track = tracks.find((t) => t.trackId === trackId)
      if (!track) {
        throw new Error("Product not found")
      }

      if (track.stock <= 0) {
        throw new Error("Product out of stock")
      }

      if (paymentToken.balance < track.price) {
        throw new Error(`Insufficient balance. Need ${track.price.toString()} ${paymentToken.symbol}`)
      }

      setPurchaseState({
        isLoading: true,
        error: null,
        txHash: null,
        step: "checking-allowance",
      })

      try {
        // Check token allowance
        const allowance = await contractService.getTokenAllowance(paymentToken.address, userAddress)

        if (allowance < track.price) {
          setPurchaseState((prev) => ({ ...prev, step: "approving" }))

          // Request token approval
          const approveTxHash = await contractService.approveToken(paymentToken.address, track.price)

          // Wait for approval
          await contractService.waitForTransaction(approveTxHash)
        }

        setPurchaseState((prev) => ({ ...prev, step: "purchasing" }))

        // Execute purchase
        const purchaseTxHash = await contractService.purchaseFromTrack(trackId, paymentToken.address, userAddress)

        setPurchaseState({
          isLoading: false,
          error: null,
          txHash: purchaseTxHash,
          step: "success",
        })

        // Monitor transaction
        transactionMonitor.watchTransaction(purchaseTxHash, trackId, track.price.toString(), (status) => {
          setRecentTransactions((prev) => {
            const updated = prev.filter((tx) => tx.hash !== status.hash)
            return [status, ...updated].slice(0, UI_CONFIG.maxTransactionHistory)
          })

          if (status.status === "confirmed") {
            // Refresh data after successful purchase
            loadContractData()
          }
        })

        // Add to recent transactions
        setRecentTransactions((prev) =>
          [
            {
              hash: purchaseTxHash,
              status: "pending",
              timestamp: Date.now(),
              trackId,
              amount: track.price.toString(),
            },
            ...prev,
          ].slice(0, UI_CONFIG.maxTransactionHistory),
        )
      } catch (error: any) {
        console.error("Purchase failed:", error)
        setPurchaseState({
          isLoading: false,
          error: error.message || "Purchase failed",
          txHash: null,
          step: "error",
        })
      }
    },
    [userAddress, paymentToken, tracks, contractService, transactionMonitor, loadContractData],
  )

  const dismissPurchaseState = useCallback(() => {
    setPurchaseState({
      isLoading: false,
      error: null,
      txHash: null,
      step: "idle",
    })
  }, [])

  // Load data on mount and when user changes
  useEffect(() => {
    loadContractData()
  }, [loadContractData])

  // Set up periodic refresh
  useEffect(() => {
    if (!contractExists) return

    const interval = setInterval(() => {
      loadContractData()
    }, UI_CONFIG.refreshInterval)

    return () => clearInterval(interval)
  }, [contractExists, loadContractData])

  return {
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
    refreshData: loadContractData,
    dismissPurchaseState,
  }
}
