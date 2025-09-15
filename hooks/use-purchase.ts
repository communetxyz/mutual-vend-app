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
    console.log("writeData changed:", writeData)
    console.log("isWritePending:", isWritePending)
    console.log("writeError:", writeError?.message)

    if (writeData) {
      console.log("✅ Transaction hash received:", writeData)
      console.log("Transaction type:", purchaseState.isApproving ? "approval" : "purchase")
      setPurchaseState((prev) => ({ ...prev, txHash: writeData }))
      toast.success(`Transaction sent! Hash: ${writeData.slice(0, 10)}...`)
    }
  }, [writeData, isWritePending, writeError, purchaseState.isApproving])

  // Monitor write contract errors
  useEffect(() => {
    if (writeError) {
      console.error("❌ Write contract error:", writeError)
      let errorMessage = "Transaction failed"

      if (writeError.message.includes("User rejected") || writeError.message.includes("rejected")) {
        errorMessage = "Transaction was rejected by user"
      } else if (writeError.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas"
      } else if (writeError.message.includes("network")) {
        errorMessage = "Network error - please check your connection"
      } else if (writeError.message.includes("connector")) {
        errorMessage = "Wallet connection error - please reconnect"
      } else if (writeError.message.includes("timeout")) {
        errorMessage = "Transaction timeout - please try again"
      }

      setPurchaseState((prev) => ({
        ...prev,
        error: errorMessage,
        isApproving: false,
        isPurchasing: false,
      }))
      toast.error(errorMessage)
    }
  }, [writeError])

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
  }

  const checkAllowance = () => {
    if (!purchaseState.selectedTrack || !purchaseState.selectedToken || chainId !== gnosis.id) return false

    const requiredAllowance = purchaseState.selectedTrack.price
    return allowance ? allowance >= requiredAllowance : false
  }

  const approveToken = async () => {
    console.log("=== Starting Approval ===")
    console.log("Connector name:", connector?.name)
    console.log("Connector type:", connector?.type)
    console.log("Current chainId:", chainId)
    console.log("Address:", address)
    console.log("isWritePending:", isWritePending)

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

    if (chainId !== gnosis.id) {
      toast.error("Network switch incomplete. Please try again.")
      return
    }

    try {
      // Reset any previous write state
      resetWrite()

      setPurchaseState((prev) => ({ ...prev, isApproving: true, error: null, txHash: null }))

      const approvalAmount = purchaseState.selectedTrack.price * 2n

      console.log("=== Approval Transaction Details ===")
      console.log("Token address:", purchaseState.selectedToken.address)
      console.log("Spender address:", VENDING_MACHINE_ADDRESS)
      console.log("Amount:", approvalAmount.toString())
      console.log("Chain ID:", gnosis.id)

      // For WalletConnect, add extra delay and check connection
      if (connector?.type === "walletConnect") {
        console.log("WalletConnect detected - checking connection...")
        if (!connectorClient) {
          throw new Error("WalletConnect client not ready")
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      console.log("Calling writeContract for approval...")
      writeContract({
        address: purchaseState.selectedToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [VENDING_MACHINE_ADDRESS, approvalAmount],
        chainId: gnosis.id,
      })

      console.log("writeContract called, waiting for response...")

      // Add timeout for WalletConnect
      if (connector?.type === "walletConnect") {
        setTimeout(() => {
          if (purchaseState.isApproving && !writeData && !writeError) {
            console.log("⚠️ WalletConnect timeout - no response from wallet")
            setPurchaseState((prev) => ({
              ...prev,
              error: "Wallet didn't respond. Please check your mobile wallet app.",
              isApproving: false,
            }))
            toast.error("Wallet didn't respond. Please check your mobile wallet app.")
          }
        }, 30000) // 30 second timeout
      }
    } catch (error: any) {
      console.error("❌ Approval failed:", error)
      let errorMessage = "Approval failed"

      if (error.message?.includes("User rejected") || error.message?.includes("rejected")) {
        errorMessage = "Transaction was rejected by user"
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas"
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error - please check your connection"
      } else if (error.message?.includes("connector")) {
        errorMessage = "Wallet connection error - please reconnect"
      } else if (error.message?.includes("client not ready")) {
        errorMessage = "Wallet not ready - please reconnect"
      }

      setPurchaseState((prev) => ({
        ...prev,
        error: errorMessage,
        isApproving: false,
      }))
      toast.error(errorMessage)
    }
  }

  const executePurchase = async () => {
    console.log("=== Starting Purchase ===")
    console.log("Connector name:", connector?.name)
    console.log("Connector type:", connector?.type)
    console.log("Current chainId:", chainId)
    console.log("Address:", address)
    console.log("isWritePending:", isWritePending)

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

    try {
      // Reset any previous write state
      resetWrite()

      setPurchaseState((prev) => ({ ...prev, isPurchasing: true, error: null, txHash: null }))

      console.log("=== Purchase Transaction Details ===")
      console.log("Contract address:", VENDING_MACHINE_ADDRESS)
      console.log("Track ID:", purchaseState.selectedTrack.trackId)
      console.log("Token address:", purchaseState.selectedToken.address)
      console.log("Recipient:", address)
      console.log("Chain ID:", gnosis.id)

      // For WalletConnect, add extra delay and check connection
      if (connector?.type === "walletConnect") {
        console.log("WalletConnect detected - checking connection...")
        if (!connectorClient) {
          throw new Error("WalletConnect client not ready")
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      console.log("Calling writeContract for purchase...")

      // Store the promise to monitor it
      const writePromise = writeContract({
        address: VENDING_MACHINE_ADDRESS,
        abi: VENDING_MACHINE_ABI,
        functionName: "vendFromTrack",
        args: [purchaseState.selectedTrack.trackId, purchaseState.selectedToken.address as `0x${string}`, address],
        chainId: gnosis.id,
      })

      console.log("writeContract called, waiting for response...")
      console.log("writePromise:", writePromise)

      // Monitor the write state changes
      let checkCount = 0
      const stateChecker = setInterval(() => {
        checkCount++
        console.log(`State check #${checkCount}:`, {
          isWritePending,
          writeData,
          writeError: writeError?.message,
          purchaseState: purchaseState.isPurchasing,
        })

        if (checkCount > 60) {
          // Stop after 60 checks (30 seconds)
          clearInterval(stateChecker)
          console.log("⚠️ Stopped monitoring - too many checks")
        }

        if (writeData || writeError || !purchaseState.isPurchasing) {
          clearInterval(stateChecker)
          console.log("✅ State monitoring complete")
        }
      }, 500)

      // Add timeout for WalletConnect
      if (connector?.type === "walletConnect") {
        setTimeout(() => {
          if (purchaseState.isPurchasing && !writeData && !writeError) {
            console.log("⚠️ WalletConnect timeout - no response from wallet")
            console.log("Final state:", { isWritePending, writeData, writeError })
            setPurchaseState((prev) => ({
              ...prev,
              error: "Wallet didn't respond. Please check your mobile wallet app and try again.",
              isPurchasing: false,
            }))
            toast.error("Wallet didn't respond. Please check your mobile wallet app and try again.")
            clearInterval(stateChecker)
          }
        }, 45000) // 45 second timeout
      }
    } catch (error: any) {
      console.error("❌ Purchase failed:", error)
      let errorMessage = "Purchase failed"

      if (error.message?.includes("User rejected") || error.message?.includes("rejected")) {
        errorMessage = "Transaction was rejected by user"
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas"
      } else if (error.message?.includes("InsufficientStock")) {
        errorMessage = "Product is out of stock"
      } else if (error.message?.includes("InsufficientBalance")) {
        errorMessage = "Insufficient token balance"
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error - please check your connection"
      } else if (error.message?.includes("connector")) {
        errorMessage = "Wallet connection error - please reconnect"
      } else if (error.message?.includes("client not ready")) {
        errorMessage = "Wallet not ready - please reconnect"
      }

      setPurchaseState((prev) => ({
        ...prev,
        error: errorMessage,
        isPurchasing: false,
      }))
      toast.error(errorMessage)
    }
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
  }
}
