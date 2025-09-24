"use client"

import { useState } from "react"
import { useWriteContract, useAccount, useChainId, useSwitchChain } from "wagmi"
import { formatEther } from "viem"
import { vendingMachineAbi } from "@/lib/contracts/vending-machine-abi"
import { erc20Abi } from "@/lib/contracts/erc20-abi"
import type { PurchaseState } from "@/lib/types/vending-machine"

const VENDING_MACHINE_ADDRESS = process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS as `0x${string}`
const TARGET_CHAIN_ID = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111")

export function usePurchase() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { writeContract } = useWriteContract()

  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    isLoading: false,
    error: null,
    success: false,
  })

  const validateTransaction = async () => {
    if (!address) {
      throw new Error("Please connect your wallet")
    }

    if (chainId !== TARGET_CHAIN_ID) {
      console.log(`Switching from chain ${chainId} to ${TARGET_CHAIN_ID}`)
      await switchChain({ chainId: TARGET_CHAIN_ID })
      throw new Error("Please switch to the correct network")
    }

    if (!VENDING_MACHINE_ADDRESS) {
      throw new Error("Vending machine contract not configured")
    }
  }

  const approveToken = async (tokenAddress: string, amount: bigint) => {
    try {
      await validateTransaction()

      setPurchaseState({
        isLoading: true,
        error: null,
        success: false,
      })

      console.log("Approving token:", {
        tokenAddress,
        spender: VENDING_MACHINE_ADDRESS,
        amount: formatEther(amount),
      })

      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [VENDING_MACHINE_ADDRESS, amount],
      })

      setPurchaseState({
        isLoading: false,
        error: null,
        success: true,
      })

      return true
    } catch (error: any) {
      console.error("Token approval failed:", error)
      setPurchaseState({
        isLoading: false,
        error: error.message || "Failed to approve token",
        success: false,
      })
      return false
    }
  }

  const executePurchase = async (trackId: number, tokenAddress: string) => {
    try {
      await validateTransaction()

      setPurchaseState({
        isLoading: true,
        error: null,
        success: false,
      })

      console.log("Executing purchase:", {
        trackId,
        tokenAddress,
        recipient: address,
      })

      await writeContract({
        address: VENDING_MACHINE_ADDRESS,
        abi: vendingMachineAbi,
        functionName: "vendFromTrack",
        args: [trackId, tokenAddress as `0x${string}`, address],
      })

      setPurchaseState({
        isLoading: false,
        error: null,
        success: true,
      })

      return true
    } catch (error: any) {
      console.error("Purchase failed:", error)
      setPurchaseState({
        isLoading: false,
        error: error.message || "Purchase failed",
        success: false,
      })
      return false
    }
  }

  const resetPurchaseState = () => {
    setPurchaseState({
      isLoading: false,
      error: null,
      success: false,
    })
  }

  return {
    ...purchaseState,
    approveToken,
    executePurchase,
    resetPurchaseState,
  }
}
