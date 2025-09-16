"use client"

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi"
import { parseUnits } from "viem"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { ERC20_ABI } from "@/lib/contracts/erc20-abi"

export function usePurchase() {
  const { address } = useAccount()
  const [isApproving, setIsApproving] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Separate hooks for approval and purchase - just like the working approve feature
  const {
    writeContract: writeApproval,
    data: approvalHash,
    error: approvalError,
    isPending: approvalPending,
  } = useWriteContract()

  const {
    writeContract: writePurchase,
    data: purchaseHash,
    error: purchaseError,
    isPending: purchasePending,
  } = useWriteContract()

  // Wait for approval transaction
  const { isLoading: approvalConfirming, isSuccess: approvalSuccess } = useWaitForTransactionReceipt({
    hash: approvalHash,
  })

  // Wait for purchase transaction
  const { isLoading: purchaseConfirming, isSuccess: purchaseSuccess } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  })

  const approveToken = async (tokenAddress: string, amount: string, decimals: number) => {
    if (!address) {
      setError("Please connect your wallet")
      return
    }

    try {
      setError(null)
      setIsApproving(true)

      const parsedAmount = parseUnits(amount, decimals)

      writeApproval({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS as `0x${string}`, parsedAmount],
      })
    } catch (err) {
      console.error("Approval error:", err)
      setError(err instanceof Error ? err.message : "Failed to approve token")
      setIsApproving(false)
    }
  }

  const purchaseProduct = async (trackId: number, tokenAddress: string) => {
    if (!address) {
      setError("Please connect your wallet")
      return
    }

    try {
      setError(null)
      setIsPurchasing(true)

      writePurchase({
        address: process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS as `0x${string}`,
        abi: VENDING_MACHINE_ABI,
        functionName: "purchaseProduct",
        args: [BigInt(trackId), tokenAddress as `0x${string}`],
      })
    } catch (err) {
      console.error("Purchase error:", err)
      setError(err instanceof Error ? err.message : "Failed to purchase product")
      setIsPurchasing(false)
    }
  }

  // Update states based on transaction status
  if (approvalSuccess && isApproving) {
    setIsApproving(false)
  }

  if (purchaseSuccess && isPurchasing) {
    setIsPurchasing(false)
  }

  if (approvalError && isApproving) {
    setError(approvalError.message)
    setIsApproving(false)
  }

  if (purchaseError && isPurchasing) {
    setError(purchaseError.message)
    setIsPurchasing(false)
  }

  return {
    // Approval states
    approveToken,
    isApproving: isApproving || approvalPending || approvalConfirming,
    approvalSuccess,
    approvalHash,

    // Purchase states
    purchaseProduct,
    isPurchasing: isPurchasing || purchasePending || purchaseConfirming,
    purchaseSuccess,
    purchaseHash,

    // Shared states
    error,
    setError,
  }
}
