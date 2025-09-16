"use client"

import { useState, useEffect } from "react"
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useChainId,
  useSwitchChain,
} from "wagmi"
import { gnosis } from "wagmi/chains"
import { VENDING_MACHINE_ABI } from "@/lib/contracts"
import { ERC20_ABI } from "@/lib/contracts"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import type { Track, TokenInfo, PurchaseState } from "@/lib/types/vending-machine"
import { toast } from "sonner"

export function usePurchase() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // Separate write contracts for approval and purchase - EXACTLY like approve works
  const approvalWrite = useWriteContract()
  const purchaseWrite = useWriteContract()

  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    selectedTrack: null,
    selectedToken: null,
    isApproving: false,
    isPurchasing: false,
    txHash: null,
    error: null,
    step: "idle",
  })

  // Check token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: purchaseState.selectedToken?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && purchaseState.selectedToken ? [address, VENDING_MACHINE_ADDRESS] : undefined,
    chainId: gnosis.id,
    query: {
      enabled: !!address && !!purchaseState.selectedToken && chainId === gnosis.id,
    },
  })

  // Wait for approval transaction - EXACTLY like approve works
  const { isLoading: isApprovingTx, isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approvalWrite.data,
    chainId: gnosis.id,
  })

  // Wait for purchase transaction - EXACTLY like approve works
  const { isLoading: isPurchasingTx, isSuccess: isPurchaseConfirmed } = useWaitForTransactionReceipt({
    hash: purchaseWrite.data,
    chainId: gnosis.id,
  })

  // Handle approval success - EXACTLY like approve works
  useEffect(() => {
    if (approvalWrite.data && !purchaseState.isApproving) {
      console.log("✅ Approval transaction sent:", approvalWrite.data)
      setPurchaseState((prev) => ({
        ...prev,
        isApproving: true,
        txHash: approvalWrite.data,
        error: null,
        step: "approving",
      }))
      toast.success(`Approval transaction sent!`)
    }
  }, [approvalWrite.data, purchaseState.isApproving])

  // Handle purchase success - EXACTLY like approve works
  useEffect(() => {
    if (purchaseWrite.data && !purchaseState.isPurchasing) {
      console.log("✅ Purchase transaction sent:", purchaseWrite.data)
      setPurchaseState((prev) => ({
        ...prev,
        isPurchasing: true,
        txHash: purchaseWrite.data,
        error: null,
        step: "purchasing",
      }))
      toast.success(`Purchase transaction sent!`)
    }
  }, [purchaseWrite.data, purchaseState.isPurchasing])

  // Handle approval confirmation - EXACTLY like approve works
  useEffect(() => {
    if (isApprovalConfirmed && purchaseState.isApproving) {
      console.log("✅ Approval confirmed, refetching allowance...")
      setPurchaseState((prev) => ({
        ...prev,
        isApproving: false,
        txHash: null,
        step: "idle",
      }))
      refetchAllowance()
      toast.success("Token approval confirmed! You can now purchase.")
    }
  }, [isApprovalConfirmed, purchaseState.isApproving, refetchAllowance])

  // Handle purchase confirmation - EXACTLY like approve works
  useEffect(() => {
    if (isPurchaseConfirmed && purchaseState.isPurchasing) {
      console.log("✅ Purchase confirmed!")
      setPurchaseState((prev) => ({
        ...prev,
        isPurchasing: false,
        txHash: null,
        step: "completed",
      }))
      toast.success("Purchase successful! Enjoy your snack!")
    }
  }, [isPurchaseConfirmed, purchaseState.isPurchasing])

  // Handle approval errors - EXACTLY like approve works
  useEffect(() => {
    if (approvalWrite.error) {
      console.error("❌ Approval error:", approvalWrite.error)
      let errorMessage = "Approval failed"

      if (approvalWrite.error.message.includes("rejected")) {
        errorMessage = "Approval was rejected by user"
      } else if (approvalWrite.error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas"
      }

      setPurchaseState((prev) => ({
        ...prev,
        error: errorMessage,
        isApproving: false,
        txHash: null,
        step: "idle",
      }))
      toast.error(errorMessage)
    }
  }, [approvalWrite.error])

  // Handle purchase errors - EXACTLY like approve works
  useEffect(() => {
    if (purchaseWrite.error) {
      console.error("❌ Purchase error:", purchaseWrite.error)
      let errorMessage = "Purchase failed"

      if (purchaseWrite.error.message.includes("rejected")) {
        errorMessage = "Purchase was rejected by user"
      } else if (purchaseWrite.error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas"
      }

      setPurchaseState((prev) => ({
        ...prev,
        error: errorMessage,
        isPurchasing: false,
        txHash: null,
        step: "idle",
      }))
      toast.error(errorMessage)
    }
  }, [purchaseWrite.error])

  const selectTrackAndToken = async (track: Track, token: TokenInfo) => {
    // Ensure correct network
    if (chainId !== gnosis.id) {
      try {
        toast.info("Switching to Gnosis Chain...")
        await switchChain({ chainId: gnosis.id })
        toast.success("Successfully switched to Gnosis Chain!")
      } catch (error) {
        toast.error("Please manually switch to Gnosis Chain in your wallet")
        return
      }
    }

    setPurchaseState({
      selectedTrack: track,
      selectedToken: token,
      isApproving: false,
      isPurchasing: false,
      txHash: null,
      error: null,
      step: "idle",
    })
  }

  const checkAllowance = () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || chainId !== gnosis.id) {
      return false
    }
    const requiredAllowance = purchaseState.selectedTrack.price
    return allowance ? allowance >= requiredAllowance : false
  }

  const approveToken = async () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || !address) {
      toast.error("Missing purchase information")
      return
    }

    console.log("=== Starting Approval ===")
    const approvalAmount = purchaseState.selectedTrack.price * 2n

    // Use writeContract EXACTLY like approve works - NO TIMEOUT LOGIC
    approvalWrite.writeContract({
      address: purchaseState.selectedToken.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [VENDING_MACHINE_ADDRESS, approvalAmount],
      chainId: gnosis.id,
    })
  }

  const executePurchase = async () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || !address) {
      toast.error("Missing purchase information")
      return
    }

    // Validate balances and stock
    if (purchaseState.selectedToken.balance < purchaseState.selectedTrack.price) {
      toast.error("Insufficient token balance")
      return
    }

    if (purchaseState.selectedTrack.stock === 0n) {
      toast.error("Product out of stock")
      return
    }

    console.log("=== Starting Purchase ===")

    // Use writeContract EXACTLY like approve works - NO TIMEOUT LOGIC
    purchaseWrite.writeContract({
      address: VENDING_MACHINE_ADDRESS,
      abi: VENDING_MACHINE_ABI,
      functionName: "vendFromTrack",
      args: [purchaseState.selectedTrack.trackId, purchaseState.selectedToken.address as `0x${string}`, address],
      chainId: gnosis.id,
    })
  }

  const resetPurchase = () => {
    approvalWrite.reset()
    purchaseWrite.reset()
    setPurchaseState({
      selectedTrack: null,
      selectedToken: null,
      isApproving: false,
      isPurchasing: false,
      txHash: null,
      error: null,
      step: "idle",
    })
  }

  return {
    purchaseState,
    selectTrackAndToken,
    checkAllowance,
    approveToken,
    executePurchase,
    resetPurchase,
    isConfirming: isApprovingTx || isPurchasingTx,
    isConfirmed: isApprovalConfirmed || isPurchaseConfirmed,
    refetchAllowance,
    isCorrectNetwork: chainId === gnosis.id,
    connectorChainId: chainId,
    isWritePending: approvalWrite.isPending || purchaseWrite.isPending,
  }
}
