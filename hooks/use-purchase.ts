"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useConnectorClient } from "wagmi"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { ERC20_ABI } from "@/lib/contracts/erc20-abi"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

interface PurchaseState {
  selectedTrack: Track | null
  selectedToken: TokenInfo | null
  isApproving: boolean
  isPurchasing: boolean
  txHash: string | null
  error: string | null
}

export function usePurchase() {
  const { address } = useAccount()
  const { data: connectorClient } = useConnectorClient()
  const { writeContract, isPending: isWritePending } = useWriteContract()

  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    selectedTrack: null,
    selectedToken: null,
    isApproving: false,
    isPurchasing: false,
    txHash: null,
    error: null,
  })

  const [allowanceRefetchTrigger, setAllowanceRefetchTrigger] = useState(0)

  // Get current allowance for selected token
  const { data: allowanceData, refetch: refetchAllowanceData } = useReadContract({
    address: purchaseState.selectedToken?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address!, VENDING_MACHINE_ADDRESS],
    query: {
      enabled: !!(purchaseState.selectedToken && address),
    },
  })

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: purchaseState.txHash as `0x${string}`,
    query: {
      enabled: !!purchaseState.txHash,
    },
  })

  const connectorChainId = connectorClient?.chain?.id

  const selectTrackAndToken = (track: Track, token: TokenInfo) => {
    setPurchaseState((prev) => ({
      ...prev,
      selectedTrack: track,
      selectedToken: token,
      error: null,
    }))
  }

  const checkAllowance = (): boolean => {
    if (!allowanceData || !purchaseState.selectedTrack) return false

    const requiredAmount = purchaseState.selectedTrack.price
    const currentAllowance = allowanceData as bigint

    return currentAllowance >= requiredAmount
  }

  const approveToken = async () => {
    if (!purchaseState.selectedToken || !purchaseState.selectedTrack) return

    try {
      setPurchaseState((prev) => ({ ...prev, isApproving: true, error: null }))

      const hash = await writeContract({
        address: purchaseState.selectedToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [VENDING_MACHINE_ADDRESS, purchaseState.selectedTrack.price],
      })

      setPurchaseState((prev) => ({ ...prev, txHash: hash }))
    } catch (error) {
      console.error("Approval failed:", error)
      setPurchaseState((prev) => ({
        ...prev,
        error: "Failed to approve token spending",
        isApproving: false,
      }))
    }
  }

  const executePurchase = async () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || !address) return

    try {
      setPurchaseState((prev) => ({ ...prev, isPurchasing: true, error: null }))

      const hash = await writeContract({
        address: VENDING_MACHINE_ADDRESS,
        abi: VENDING_MACHINE_ABI,
        functionName: "vendFromTrack",
        args: [purchaseState.selectedTrack.trackId, purchaseState.selectedToken.address, address],
      })

      setPurchaseState((prev) => ({ ...prev, txHash: hash }))
    } catch (error) {
      console.error("Purchase failed:", error)
      setPurchaseState((prev) => ({
        ...prev,
        error: "Failed to complete purchase",
        isPurchasing: false,
      }))
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

  const refetchAllowance = () => {
    setAllowanceRefetchTrigger((prev) => prev + 1)
    refetchAllowanceData()
  }

  // Reset states when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      setPurchaseState((prev) => ({
        ...prev,
        isApproving: false,
        isPurchasing: false,
      }))
      // Refetch allowance after successful transaction
      setTimeout(() => {
        refetchAllowance()
      }, 1000)
    }
  }, [isConfirmed])

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
    connectorChainId,
    isWritePending,
  }
}
