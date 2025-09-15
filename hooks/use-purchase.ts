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
  const { address, connector } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const {
    writeContract,
    isPending: isWritePending,
    error: writeError,
    data: writeData,
    reset: resetWrite,
  } = useWriteContract()
  const { data: connectorClient } = useConnectorClient()
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    selectedTrack: null,
    selectedToken: null,
    isApproving: false,
    isPurchasing: false,
    txHash: null,
    error: null,
  })
  const [retryCount, setRetryCount] = useState(0)

  // Validate and switch to Gnosis Chain with retry logic
  const ensureCorrectNetwork = async (): Promise<boolean> => {
    console.log("=== Network Check ===")
    console.log("Current chainId:", chainId, "Target:", gnosis.id)
    console.log("Connector client chain:", connectorClient?.chain?.id)
    console.log("Connector name:", connector?.name)
    console.log("Connector type:", connector?.type)

    if (chainId !== gnosis.id) {
      try {
        toast.info("Switching to Gnosis Chain...")

        // For WalletConnect, we need to be more patient
        if (connector?.type === "walletConnect" || connector?.name?.toLowerCase().includes("walletconnect")) {
          console.log("WalletConnect detected, using extended timeout...")
          await switchChain({ chainId: gnosis.id })
          await new Promise((resolve) => setTimeout(resolve, 3000))
        } else {
          await switchChain({ chainId: gnosis.id })
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }

        // Verify the switch worked
        const finalChainId = connectorClient?.chain?.id
        console.log("After switch - Connector chain:", finalChainId)

        if (finalChainId !== gnosis.id) {
          console.error("Chain switch failed. Expected:", gnosis.id, "Got:", finalChainId)
          toast.error("Please manually switch to Gnosis Chain in your wallet app")
          return false
        }

        toast.success("Successfully switched to Gnosis Chain!")
        return true
      } catch (error) {
        console.error("Failed to switch chain:", error)
        toast.error("Please manually switch to Gnosis Chain in your wallet app")
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
    chainId: gnosis.id,
    query: {
      enabled: !!address && !!purchaseState.selectedToken && chainId === gnosis.id,
    },
  })

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: purchaseState.txHash as `0x${string}`,
    chainId: gnosis.id,
  })

  // Monitor writeContract data changes (this is where the hash comes from)
  useEffect(() => {
    if (writeData) {
      console.log("✅ Transaction hash received:", writeData)
      console.log("Transaction type:", purchaseState.isApproving ? "approval" : "purchase")
      setPurchaseState((prev) => ({ ...prev, txHash: writeData }))
      setRetryCount(0) // Reset retry count on success
      toast.success(`Transaction sent! Hash: ${writeData.slice(0, 10)}...`)
    }
  }, [writeData, purchaseState.isApproving])

  // Monitor write contract errors with retry logic
  useEffect(() => {
    if (writeError) {
      console.error("❌ Write contract error:", writeError)

      // Check if it's a WalletConnect timeout/expiry error
      const isWalletConnectTimeout =
        writeError.message.includes("Request expired") ||
        writeError.message.includes("timeout") ||
        writeError.message.includes("expired") ||
        writeError.message.includes("connection closed")

      if (isWalletConnectTimeout && retryCount < 2) {
        console.log(`🔄 WalletConnect timeout detected. Retry attempt ${retryCount + 1}/2`)
        setRetryCount((prev) => prev + 1)

        toast.error(`Connection timeout. Retrying... (${retryCount + 1}/2)`)

        // Wait a moment then retry
        setTimeout(() => {
          if (purchaseState.isApproving) {
            retryApproval()
          } else if (purchaseState.isPurchasing) {
            retryPurchase()
          }
        }, 2000)
        return
      }

      // Handle other errors or max retries reached
      let errorMessage = "Transaction failed"

      if (writeError.message.includes("User rejected") || writeError.message.includes("rejected")) {
        errorMessage = "Transaction was rejected by user"
      } else if (writeError.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas"
      } else if (isWalletConnectTimeout) {
        errorMessage = "Connection timeout. Please ensure your mobile wallet is connected and try again."
      } else if (writeError.message.includes("network")) {
        errorMessage = "Network error - please check your connection"
      } else if (writeError.message.includes("connector")) {
        errorMessage = "Wallet connection error - please reconnect"
      }

      setPurchaseState((prev) => ({
        ...prev,
        error: errorMessage,
        isApproving: false,
        isPurchasing: false,
      }))
      toast.error(errorMessage)
      setRetryCount(0) // Reset retry count
    }
  }, [writeError, retryCount, purchaseState.isApproving, purchaseState.isPurchasing])

  // Auto-refetch allowance when approval transaction is confirmed
  useEffect(() => {
    if (isConfirmed && purchaseState.isApproving) {
      console.log("Approval confirmed, refetching allowance...")
      refetchAllowance()

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
    setRetryCount(0) // Reset retry count for new transaction
  }

  const checkAllowance = () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || chainId !== gnosis.id) return false

    const requiredAllowance = purchaseState.selectedTrack.price
    return allowance ? allowance >= requiredAllowance : false
  }

  const executeWriteContract = async (contractCall: () => void, isApproval = false) => {
    try {
      // Reset any previous write state
      resetWrite()

      // For WalletConnect, ensure connection is stable
      if (connector?.type === "walletConnect") {
        console.log("🔗 WalletConnect - Ensuring stable connection...")

        if (!connectorClient) {
          throw new Error("WalletConnect client not ready")
        }

        // Give WalletConnect extra time to stabilize
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Check if connection is still active
        if (!connectorClient.account) {
          throw new Error("WalletConnect session expired")
        }
      }

      console.log(`📱 Sending ${isApproval ? "approval" : "purchase"} request to wallet...`)
      contractCall()

      // Show user guidance for WalletConnect
      if (connector?.type === "walletConnect") {
        toast.info("Check your mobile wallet app to approve the transaction", {
          duration: 8000,
        })
      }
    } catch (error: any) {
      console.error(`❌ ${isApproval ? "Approval" : "Purchase"} setup failed:`, error)

      let errorMessage = `${isApproval ? "Approval" : "Purchase"} failed`

      if (error.message?.includes("client not ready") || error.message?.includes("session expired")) {
        errorMessage = "Wallet connection lost. Please reconnect and try again."
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error - please check your connection"
      }

      setPurchaseState((prev) => ({
        ...prev,
        error: errorMessage,
        isApproving: false,
        isPurchasing: false,
      }))
      toast.error(errorMessage)
    }
  }

  const approveToken = async () => {
    console.log("=== Starting Approval ===")

    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || !address) {
      toast.error("Missing purchase information")
      return
    }

    if (!connector) {
      toast.error("No wallet connected")
      return
    }

    // Ensure we're on the correct network
    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    setPurchaseState((prev) => ({ ...prev, isApproving: true, error: null, txHash: null }))

    const approvalAmount = purchaseState.selectedTrack.price * 2n

    await executeWriteContract(() => {
      writeContract({
        address: purchaseState.selectedToken!.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [VENDING_MACHINE_ADDRESS, approvalAmount],
        chainId: gnosis.id,
      })
    }, true)
  }

  const retryApproval = async () => {
    console.log("🔄 Retrying approval...")
    await approveToken()
  }

  const executePurchase = async () => {
    console.log("=== Starting Purchase ===")

    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || !address) {
      toast.error("Missing purchase information")
      return
    }

    if (!connector) {
      toast.error("No wallet connected")
      return
    }

    // Ensure we're on the correct network
    const networkOk = await ensureCorrectNetwork()
    if (!networkOk) return

    // Validate balances and stock
    if (purchaseState.selectedToken.balance < purchaseState.selectedTrack.price) {
      toast.error("Insufficient token balance")
      return
    }

    if (purchaseState.selectedTrack.stock === 0n) {
      toast.error("Product out of stock")
      return
    }

    setPurchaseState((prev) => ({ ...prev, isPurchasing: true, error: null, txHash: null }))

    await executeWriteContract(() => {
      writeContract({
        address: VENDING_MACHINE_ADDRESS,
        abi: VENDING_MACHINE_ABI,
        functionName: "vendFromTrack",
        args: [purchaseState.selectedTrack!.trackId, purchaseState.selectedToken!.address as `0x${string}`, address],
        chainId: gnosis.id,
      })
    }, false)
  }

  const retryPurchase = async () => {
    console.log("🔄 Retrying purchase...")
    await executePurchase()
  }

  const resetPurchase = () => {
    resetWrite() // Reset the writeContract state
    setPurchaseState({
      selectedTrack: null,
      selectedToken: null,
      isApproving: false,
      isPurchasing: false,
      txHash: null,
      error: null,
    })
    setRetryCount(0)
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
    isWritePending,
    retryCount,
  }
}
