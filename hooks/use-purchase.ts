"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { ERC20_ABI } from "@/lib/contracts/erc20-abi"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import type { Track, TokenInfo, PurchaseState } from "@/lib/types/vending-machine"
import { toast } from "sonner"

export function usePurchase() {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    selectedTrack: null,
    selectedToken: null,
    isApproving: false,
    isPurchasing: false,
    txHash: null,
    error: null,
  })

  // Check token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: purchaseState.selectedToken?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && purchaseState.selectedToken ? [address, VENDING_MACHINE_ADDRESS] : undefined,
    query: {
      enabled: !!address && !!purchaseState.selectedToken,
    },
  })

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: purchaseState.txHash as `0x${string}`,
  })

  const selectTrackAndToken = (track: Track, token: TokenInfo) => {
    setPurchaseState((prev) => ({
      ...prev,
      selectedTrack: track,
      selectedToken: token,
      error: null,
    }))
  }

  const checkAllowance = () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken) return false

    const requiredAllowance = purchaseState.selectedTrack.price
    return allowance ? allowance >= requiredAllowance : false
  }

  const approveToken = async () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || !address) {
      toast.error("Missing purchase information")
      return
    }

    try {
      setPurchaseState((prev) => ({ ...prev, isApproving: true, error: null }))

      const approvalAmount = purchaseState.selectedTrack.price * 2n // Approve 2x for future purchases

      writeContract(
        {
          address: purchaseState.selectedToken.address as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [VENDING_MACHINE_ADDRESS, approvalAmount],
        },
        {
          onSuccess: (hash) => {
            setPurchaseState((prev) => ({ ...prev, txHash: hash }))
            toast.success("Approval transaction sent!")
          },
          onError: (error) => {
            console.error("Approval failed:", error)
            setPurchaseState((prev) => ({
              ...prev,
              error: "Approval failed: " + error.message,
              isApproving: false,
            }))
            toast.error("Approval failed")
          },
        },
      )
    } catch (error) {
      console.error("Approval error:", error)
      setPurchaseState((prev) => ({
        ...prev,
        error: "Approval error: " + (error as Error).message,
        isApproving: false,
      }))
      toast.error("Approval error")
    }
  }

  const executePurchase = async () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || !address) {
      toast.error("Missing purchase information")
      return
    }

    if (purchaseState.selectedToken.balance < purchaseState.selectedTrack.price) {
      toast.error("Insufficient token balance")
      return
    }

    if (purchaseState.selectedTrack.stock === 0n) {
      toast.error("Product out of stock")
      return
    }

    try {
      setPurchaseState((prev) => ({ ...prev, isPurchasing: true, error: null }))

      writeContract(
        {
          address: VENDING_MACHINE_ADDRESS,
          abi: VENDING_MACHINE_ABI,
          functionName: "vendFromTrack",
          args: [purchaseState.selectedTrack.trackId, purchaseState.selectedToken.address as `0x${string}`, address],
        },
        {
          onSuccess: (hash) => {
            setPurchaseState((prev) => ({ ...prev, txHash: hash }))
            toast.success("Purchase transaction sent!")
          },
          onError: (error) => {
            console.error("Purchase failed:", error)
            setPurchaseState((prev) => ({
              ...prev,
              error: "Purchase failed: " + error.message,
              isPurchasing: false,
            }))
            toast.error("Purchase failed")
          },
        },
      )
    } catch (error) {
      console.error("Purchase error:", error)
      setPurchaseState((prev) => ({
        ...prev,
        error: "Purchase error: " + (error as Error).message,
        isPurchasing: false,
      }))
      toast.error("Purchase error")
    }
  }

  const resetPurchase = () => {
    setPurchaseState({
      selectedTrack: null,
      selectedToken: null,
      isApproving: false,
      isPurchasing: false,
      txHash: null,
      error: null,
    })
  }

  return {
    purchaseState,
    selectTrackAndToken,
    checkAllowance,
    approveToken,
    executePurchase,
    resetPurchase,
    isConfirming,
    isConfirmed,
    refetchAllowance,
  }
}
