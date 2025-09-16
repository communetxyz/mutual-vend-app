"use client"

import React from "react"

import { useState, useCallback } from "react"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount, useChainId } from "wagmi"
import { vendingMachineAbi } from "@/lib/contracts/vending-machine-abi"
import { erc20Abi } from "@/lib/contracts/erc20-abi"
import type { Track, TokenInfo, PurchaseState } from "@/lib/types/vending-machine"

const VENDING_MACHINE_ADDRESS = process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS as `0x${string}`

export function usePurchase() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    selectedTrack: null,
    selectedToken: null,
    isApproving: false,
    isPurchasing: false,
    txHash: null,
    error: null,
    step: "idle",
  })

  // Separate hooks for approval and purchase
  const {
    writeContract: writeApproval,
    data: approvalHash,
    error: approvalError,
    isPending: isApprovalPending,
  } = useWriteContract()

  const {
    writeContract: writePurchase,
    data: purchaseHash,
    error: purchaseError,
    isPending: isPurchasePending,
  } = useWriteContract()

  // Wait for transaction confirmations
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approvalHash,
  })

  const { isLoading: isPurchaseConfirming, isSuccess: isPurchaseConfirmed } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  })

  // Check allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: purchaseState.selectedToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && purchaseState.selectedToken ? [address, VENDING_MACHINE_ADDRESS] : undefined,
    query: {
      enabled: !!(address && purchaseState.selectedToken && VENDING_MACHINE_ADDRESS),
    },
  })

  const selectTrackAndToken = useCallback((track: Track, token: TokenInfo) => {
    setPurchaseState({
      selectedTrack: track,
      selectedToken: token,
      isApproving: false,
      isPurchasing: false,
      txHash: null,
      error: null,
      step: "idle",
    })
  }, [])

  const checkAllowance = useCallback(() => {
    if (!allowanceData || !purchaseState.selectedTrack) return false
    return (allowanceData as bigint) >= purchaseState.selectedTrack.price
  }, [allowanceData, purchaseState.selectedTrack])

  const approveToken = useCallback(async () => {
    if (!purchaseState.selectedToken || !purchaseState.selectedTrack) return

    try {
      setPurchaseState((prev) => ({ ...prev, isApproving: true, step: "approving", error: null }))

      writeApproval({
        address: purchaseState.selectedToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [VENDING_MACHINE_ADDRESS, purchaseState.selectedTrack.price],
      })
    } catch (error) {
      console.error("Approval error:", error)
      setPurchaseState((prev) => ({
        ...prev,
        isApproving: false,
        error: "Failed to approve token spending",
        step: "idle",
      }))
    }
  }, [purchaseState.selectedToken, purchaseState.selectedTrack, writeApproval])

  const executePurchase = useCallback(async () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken) return

    try {
      setPurchaseState((prev) => ({ ...prev, isPurchasing: true, step: "purchasing", error: null }))

      writePurchase({
        address: VENDING_MACHINE_ADDRESS,
        abi: vendingMachineAbi,
        functionName: "purchase",
        args: [purchaseState.selectedTrack.trackId, purchaseState.selectedToken.address as `0x${string}`],
      })
    } catch (error) {
      console.error("Purchase error:", error)
      setPurchaseState((prev) => ({
        ...prev,
        isPurchasing: false,
        error: "Failed to execute purchase",
        step: "idle",
      }))
    }
  }, [purchaseState.selectedTrack, purchaseState.selectedToken, writePurchase])

  const resetPurchase = useCallback(() => {
    setPurchaseState({
      selectedTrack: null,
      selectedToken: null,
      isApproving: false,
      isPurchasing: false,
      txHash: null,
      error: null,
      step: "idle",
    })
  }, [])

  // Update state based on transaction status
  React.useEffect(() => {
    if (approvalError) {
      setPurchaseState((prev) => ({
        ...prev,
        isApproving: false,
        error: "Approval transaction failed",
        step: "idle",
      }))
    }
  }, [approvalError])

  React.useEffect(() => {
    if (purchaseError) {
      setPurchaseState((prev) => ({
        ...prev,
        isPurchasing: false,
        error: "Purchase transaction failed",
        step: "idle",
      }))
    }
  }, [purchaseError])

  React.useEffect(() => {
    if (isApprovalConfirmed) {
      setPurchaseState((prev) => ({ ...prev, isApproving: false }))
      refetchAllowance()
    }
  }, [isApprovalConfirmed, refetchAllowance])

  React.useEffect(() => {
    if (isPurchaseConfirmed) {
      setPurchaseState((prev) => ({
        ...prev,
        isPurchasing: false,
        step: "completed",
        txHash: purchaseHash || null,
      }))
    }
  }, [isPurchaseConfirmed, purchaseHash])

  return {
    purchaseState,
    selectTrackAndToken,
    checkAllowance,
    approveToken,
    executePurchase,
    resetPurchase,
    isConfirming: isApprovalConfirming || isPurchaseConfirming,
    isConfirmed: isPurchaseConfirmed,
    refetchAllowance,
    connectorChainId: chainId,
    isWritePending: isApprovalPending || isPurchasePending,
  }
}
