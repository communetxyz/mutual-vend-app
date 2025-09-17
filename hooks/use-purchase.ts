"use client"

import { useState, useCallback } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useConnectorClient } from "wagmi"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { ERC20_ABI } from "@/lib/contracts/erc20-abi"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import type { Track, TokenInfo, PurchaseState } from "@/lib/types/vending-machine"
import { toast } from "sonner"

export function usePurchase() {
  const { address } = useAccount()
  const { data: connectorClient } = useConnectorClient()
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract()

  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    selectedTrack: null,
    selectedToken: null,
    isApproving: false,
    isPurchasing: false,
    txHash: null,
    error: null,
  })

  // Get connector chain ID
  const connectorChainId = connectorClient?.chain?.id

  // Check allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: purchaseState.selectedToken?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && purchaseState.selectedToken ? [address, VENDING_MACHINE_ADDRESS] : undefined,
    query: {
      enabled: !!(address && purchaseState.selectedToken),
    },
  })

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const selectTrackAndToken = useCallback((track: Track, token: TokenInfo) => {
    setPurchaseState({
      selectedTrack: track,
      selectedToken: token,
      isApproving: false,
      isPurchasing: false,
      txHash: null,
      error: null,
    })
  }, [])

  const checkAllowance = useCallback(() => {
    if (!allowance || !purchaseState.selectedTrack) return false
    return allowance >= purchaseState.selectedTrack.price
  }, [allowance, purchaseState.selectedTrack])

  const approveToken = useCallback(async () => {
    if (!purchaseState.selectedToken || !purchaseState.selectedTrack) {
      toast.error("Please select a product and payment method")
      return
    }

    try {
      setPurchaseState((prev) => ({ ...prev, isApproving: true, error: null }))

      await writeContract({
        address: purchaseState.selectedToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [VENDING_MACHINE_ADDRESS, purchaseState.selectedTrack.price],
      })

      toast.success("Approval transaction submitted")
    } catch (error: any) {
      console.error("Approval error:", error)
      const errorMessage = error?.message || "Failed to approve token"
      setPurchaseState((prev) => ({ ...prev, error: errorMessage, isApproving: false }))
      toast.error(errorMessage)
    }
  }, [purchaseState.selectedToken, purchaseState.selectedTrack, writeContract])

  const executePurchase = useCallback(async () => {
    if (!purchaseState.selectedToken || !purchaseState.selectedTrack) {
      toast.error("Please select a product and payment method")
      return
    }

    try {
      setPurchaseState((prev) => ({ ...prev, isPurchasing: true, error: null }))

      await writeContract({
        address: VENDING_MACHINE_ADDRESS,
        abi: VENDING_MACHINE_ABI,
        functionName: "purchase",
        args: [BigInt(purchaseState.selectedTrack.trackId), purchaseState.selectedToken.address as `0x${string}`],
      })

      toast.success("Purchase transaction submitted")
    } catch (error: any) {
      console.error("Purchase error:", error)
      const errorMessage = error?.message || "Failed to execute purchase"
      setPurchaseState((prev) => ({ ...prev, error: errorMessage, isPurchasing: false }))
      toast.error(errorMessage)
    }
  }, [purchaseState.selectedToken, purchaseState.selectedTrack, writeContract])

  const resetPurchase = useCallback(() => {
    setPurchaseState({
      selectedTrack: null,
      selectedToken: null,
      isApproving: false,
      isPurchasing: false,
      txHash: null,
      error: null,
    })
  }, [])

  // Update purchase state when transaction is confirmed
  useState(() => {
    if (isConfirmed && hash) {
      setPurchaseState((prev) => ({
        ...prev,
        txHash: hash,
        isApproving: false,
        isPurchasing: prev.isPurchasing, // Keep isPurchasing true until we manually reset
      }))
    }
  })

  // Handle write errors
  useState(() => {
    if (writeError) {
      setPurchaseState((prev) => ({
        ...prev,
        error: writeError.message,
        isApproving: false,
        isPurchasing: false,
      }))
    }
  })

  return {
    purchaseState: {
      ...purchaseState,
      txHash: hash || purchaseState.txHash,
    },
    selectTrackAndToken,
    checkAllowance,
    approveToken,
    executePurchase,
    resetPurchase,
    isConfirming,
    isConfirmed,
    isWritePending,
    refetchAllowance,
    connectorChainId,
  }
}
