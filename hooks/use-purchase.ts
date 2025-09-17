"use client"

import { useState, useEffect } from "react"
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useChainId,
  useSwitchChain,
  useConnectorClient,
} from "wagmi"
import { gnosis } from "wagmi/chains"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { ERC20_ABI } from "@/lib/contracts/erc20-abi"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import type { Track, TokenInfo, PurchaseState } from "@/lib/types/vending-machine"
import { toast } from "sonner"

export function usePurchase() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { writeContract } = useWriteContract()
  const { data: connectorClient } = useConnectorClient()
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    selectedTrack: null,
    selectedToken: null,
    isApproving: false,
    isPurchasing: false,
    txHash: null,
    error: null,
  })

  // Validate and switch to Gnosis Chain with retry logic
  const ensureCorrectNetwork = async (): Promise<boolean> => {
    console.log("Current chainId:", chainId, "Target:", gnosis.id)

    if (chainId !== gnosis.id) {
      try {
        toast.info("Switching to Gnosis Chain...")
        await switchChain({ chainId: gnosis.id })

        // Wait a bit for the switch to complete
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Double-check the chain after switching
        if (connectorClient?.chain?.id !== gnosis.id) {
          console.error("Chain switch failed. Connector still on:", connectorClient?.chain?.id)
          toast.error("Chain switch incomplete. Please manually switch to Gnosis Chain in your wallet.")
          return false
        }

        toast.success("Successfully switched to Gnosis Chain!")
        return true
      } catch (error) {
        console.error("Failed to switch chain:", error)
        toast.error("Please manually switch to Gnosis Chain in your wallet")
        return false
      }
    }
    return true
  }

  // Check token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: purchaseState.selectedToken?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && purchaseState.selectedToken ? [address, VENDING_MACHINE_ADDRESS] : undefined,
    chainId: gnosis.id, // Force Gnosis Chain
    query: {
      enabled: !!address && !!purchaseState.selectedToken && chainId === gnosis.id,
    },
  })

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: purchaseState.txHash as `0x${string}`,
    chainId: gnosis.id, // Force Gnosis Chain
  })

  // Auto-refetch allowance when approval transaction is confirmed
  useEffect(() => {
    if (isConfirmed && purchaseState.isApproving) {
      console.log("Approval confirmed, refetching allowance...")
      refetchAllowance()

      // Reset approval state but keep modal open
      setPurchaseState((prev) => ({
        ...prev,
        isApproving: false,
        txHash: null,
      }))

      toast.success("Token approval confirmed! You can now purchase.")
    }
  }, [isConfirmed, purchaseState.isApproving, refetchAllowance])

  // Auto-close modal only after purchase is confirmed
  useEffect(() => {
    if (isConfirmed && purchaseState.isPurchasing) {
      console.log("Purchase confirmed!")
      toast.success("Purchase successful! Enjoy your snack!")

      // Small delay to show success message
      setTimeout(() => {
        setPurchaseState((prev) => ({
          ...prev,
          isPurchasing: false,
          txHash: null,
        }))
      }, 2000)
    }
  }, [isConfirmed, purchaseState.isPurchasing])

  const selectTrackAndToken = async (track: Track, token: TokenInfo) => {
    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    setPurchaseState((prev) => ({
      ...prev,
      selectedTrack: track,
      selectedToken: token,
      error: null,
    }))
  }

  const checkAllowance = () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || chainId !== gnosis.id) return false

    const requiredAllowance = purchaseState.selectedTrack.price
    return allowance ? allowance >= requiredAllowance : false
  }

  const approveToken = async () => {
    console.log("Starting approval process...")
    console.log("Current chainId:", chainId)
    console.log("Connector client chain:", connectorClient?.chain?.id)

    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || !address) {
      toast.error("Missing purchase information")
      return
    }

    // Ensure we're on the correct network before proceeding
    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    // Final validation - check both wagmi chainId and connector client
    if (chainId !== gnosis.id || connectorClient?.chain?.id !== gnosis.id) {
      toast.error(
        `Network mismatch! Wagmi: ${chainId}, Connector: ${connectorClient?.chain?.id}. Please refresh and try again.`,
      )
      return
    }

    try {
      setPurchaseState((prev) => ({ ...prev, isApproving: true, error: null }))

      const approvalAmount = purchaseState.selectedTrack.price * 2n // Approve 2x for future purchases

      console.log("Sending approval transaction on chain:", gnosis.id)
      console.log("Token address:", purchaseState.selectedToken.address)
      console.log("Spender address:", VENDING_MACHINE_ADDRESS)
      console.log("Amount:", approvalAmount.toString())

      writeContract(
        {
          address: purchaseState.selectedToken.address as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [VENDING_MACHINE_ADDRESS, approvalAmount],
          chainId: gnosis.id, // Explicitly force Gnosis Chain
        },
        {
          onSuccess: (hash) => {
            console.log("Approval transaction hash:", hash)
            setPurchaseState((prev) => ({ ...prev, txHash: hash }))
            toast.success(`Approval transaction sent! Waiting for confirmation...`)
          },
          onError: (error) => {
            console.error("Approval failed:", error)
            setPurchaseState((prev) => ({
              ...prev,
              error: "Approval failed: " + error.message,
              isApproving: false,
            }))
            toast.error("Approval failed. Check console for details.")
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
    console.log("Starting purchase process...")
    console.log("Current chainId:", chainId)
    console.log("Connector client chain:", connectorClient?.chain?.id)

    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || !address) {
      toast.error("Missing purchase information")
      return
    }

    // Ensure we're on the correct network before proceeding
    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    // Final validation - check both wagmi chainId and connector client
    if (chainId !== gnosis.id || connectorClient?.chain?.id !== gnosis.id) {
      toast.error(
        `Network mismatch! Wagmi: ${chainId}, Connector: ${connectorClient?.chain?.id}. Please refresh and try again.`,
      )
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

      console.log("Sending purchase transaction on chain:", gnosis.id)
      console.log("Contract address:", VENDING_MACHINE_ADDRESS)
      console.log("Track ID:", purchaseState.selectedTrack.trackId)
      console.log("Token address:", purchaseState.selectedToken.address)

      writeContract(
        {
          address: VENDING_MACHINE_ADDRESS,
          abi: VENDING_MACHINE_ABI,
          functionName: "vendFromTrack",
          args: [purchaseState.selectedTrack.trackId, purchaseState.selectedToken.address as `0x${string}`, address],
          chainId: gnosis.id, // Explicitly force Gnosis Chain
        },
        {
          onSuccess: (hash) => {
            console.log("Purchase transaction hash:", hash)
            setPurchaseState((prev) => ({ ...prev, txHash: hash }))
            toast.success(`Purchase transaction sent! Waiting for confirmation...`)
          },
          onError: (error) => {
            console.error("Purchase failed:", error)
            setPurchaseState((prev) => ({
              ...prev,
              error: "Purchase failed: " + error.message,
              isPurchasing: false,
            }))
            toast.error("Purchase failed. Check console for details.")
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
    isCorrectNetwork: chainId === gnosis.id,
    connectorChainId: connectorClient?.chain?.id,
  }
}
