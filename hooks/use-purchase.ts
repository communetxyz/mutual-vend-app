"use client"

import { useState } from "react"
import { useWriteContract, useSwitchChain } from "wagmi"
import { parseUnits } from "viem"
import { toast } from "@/hooks/use-toast"
import { vendingMachineAbi } from "@/lib/contracts/vending-machine-abi"
import { erc20Abi } from "@/lib/contracts/erc20-abi"
import { useAccount, useChainId } from "wagmi"

interface PurchaseState {
  isApproving: boolean
  isPurchasing: boolean
  approvalHash: string | null
  purchaseHash: string | null
  error: string | null
}

export function usePurchase() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    isApproving: false,
    isPurchasing: false,
    approvalHash: null,
    purchaseHash: null,
    error: null,
  })

  const { writeContract } = useWriteContract()

  const targetChainId = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111")

  // Validation function used by both approve and purchase
  const validateTransaction = async () => {
    if (!address) {
      throw new Error("Please connect your wallet first")
    }

    if (chainId !== targetChainId) {
      console.log(`Switching from chain ${chainId} to ${targetChainId}`)
      try {
        await switchChain({ chainId: targetChainId })
      } catch (error) {
        console.error("Failed to switch chain:", error)
        throw new Error(`Please switch to the correct network (Chain ID: ${targetChainId})`)
      }
    }
  }

  const approveToken = async (tokenAddress: string, spenderAddress: string, amount: string) => {
    try {
      await validateTransaction()

      setPurchaseState((prev) => ({ ...prev, isApproving: true, error: null }))

      const amountWei = parseUnits(amount, 18)
      console.log("Approving token:", {
        tokenAddress,
        spenderAddress,
        amount,
        amountWei: amountWei.toString(),
        chainId,
      })

      const hash = await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddress as `0x${string}`, amountWei],
        chainId: targetChainId,
      })

      console.log("Approval transaction sent:", hash)
      setPurchaseState((prev) => ({ ...prev, approvalHash: hash }))

      toast({
        title: "Approval Submitted",
        description: "Your token approval transaction has been submitted. Please wait for confirmation.",
      })

      return hash
    } catch (error: any) {
      console.error("Approval failed:", error)
      const errorMessage = error?.message || "Failed to approve tokens"
      setPurchaseState((prev) => ({ ...prev, error: errorMessage, isApproving: false }))

      toast({
        title: "Approval Failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    }
  }

  const executePurchase = async (contractAddress: string, trackId: number, paymentToken: string, amount: string) => {
    try {
      await validateTransaction()

      setPurchaseState((prev) => ({ ...prev, isPurchasing: true, error: null }))

      const amountWei = parseUnits(amount, 18)
      console.log("Executing purchase:", {
        contractAddress,
        trackId,
        paymentToken,
        amount,
        amountWei: amountWei.toString(),
        chainId,
      })

      const hash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: vendingMachineAbi,
        functionName: "purchaseItem",
        args: [BigInt(trackId), paymentToken as `0x${string}`, amountWei],
        chainId: targetChainId,
      })

      console.log("Purchase transaction sent:", hash)
      setPurchaseState((prev) => ({ ...prev, purchaseHash: hash }))

      toast({
        title: "Purchase Submitted",
        description: "Your purchase transaction has been submitted. Please wait for confirmation.",
      })

      return hash
    } catch (error: any) {
      console.error("Purchase failed:", error)
      const errorMessage = error?.message || "Failed to execute purchase"
      setPurchaseState((prev) => ({ ...prev, error: errorMessage, isPurchasing: false }))

      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    }
  }

  const resetPurchaseState = () => {
    setPurchaseState({
      isApproving: false,
      isPurchasing: false,
      approvalHash: null,
      purchaseHash: null,
      error: null,
    })
  }

  return {
    purchaseState,
    approveToken,
    executePurchase,
    resetPurchaseState,
  }
}
