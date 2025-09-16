"use client"
import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { ERC20_ABI } from "@/lib/contracts/erc20-abi"

export function usePurchase() {
  const [currentStep, setCurrentStep] = useState<"idle" | "approving" | "purchasing" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const { writeContract: approve, data: approveHash } = useWriteContract()
  const { writeContract: purchase, data: purchaseHash } = useWriteContract()

  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  const { isLoading: isPurchasing } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  })

  const executePurchase = async ({
    contractAddress,
    trackId,
    tokenAddress,
    price,
    decimals = 18,
    userAddress,
  }: {
    contractAddress: `0x${string}`
    trackId: number
    tokenAddress: `0x${string}`
    price: string
    decimals?: number
    userAddress: `0x${string}`
  }) => {
    try {
      setCurrentStep("approving")
      setError(null)

      const amount = parseUnits(price, decimals)

      // First approve the token spend
      await approve({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [contractAddress, amount],
      })

      setCurrentStep("purchasing")

      // Then make the purchase
      await purchase({
        address: contractAddress,
        abi: VENDING_MACHINE_ABI,
        functionName: "vendFromTrack",
        args: [trackId, tokenAddress, userAddress],
      })

      setCurrentStep("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed")
      setCurrentStep("error")
    }
  }

  const reset = () => {
    setCurrentStep("idle")
    setError(null)
  }

  return {
    executePurchase,
    currentStep,
    error,
    isApproving,
    isPurchasing,
    reset,
  }
}
