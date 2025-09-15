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
  const [useDirectWallet, setUseDirectWallet] = useState(false)

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

  // Direct wallet interaction for WalletConnect when wagmi fails
  const executeDirectWalletTransaction = async (
    contractAddress: string,
    abi: any[],
    functionName: string,
    args: any[],
    isApproval = false,
  ): Promise<string> => {
    if (!connectorClient) {
      throw new Error("No wallet client available")
    }

    console.log(`🔗 Using direct wallet interaction for ${isApproval ? "approval" : "purchase"}`)
    console.log("Contract:", contractAddress)
    console.log("Function:", functionName)
    console.log("Args:", args)

    try {
      // Use the connector client directly
      const hash = await connectorClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName,
        args,
        account: address as `0x${string}`,
        chain: gnosis,
      })

      console.log(`✅ Direct wallet transaction hash:`, hash)
      return hash
    } catch (error: any) {
      console.error(`❌ Direct wallet transaction failed:`, error)
      throw error
    }
  }

  const executeWithTimeout = async (contractCall: () => void, isApproval = false, timeoutMs = 30000) => {
    return new Promise<void>((resolve, reject) => {
      let timeoutId: NodeJS.Timeout
      let resolved = false

      // Set up timeout
      timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true
          console.error(`❌ ${isApproval ? "Approval" : "Purchase"} timeout after ${timeoutMs}ms`)
          reject(new Error(`Transaction timeout - no response from wallet after ${timeoutMs / 1000} seconds`))
        }
      }, timeoutMs)

      // Monitor writeData changes for success
      const checkSuccess = () => {
        if (writeData && !resolved) {
          resolved = true
          clearTimeout(timeoutId)
          console.log(`✅ ${isApproval ? "Approval" : "Purchase"} transaction hash received:`, writeData)
          resolve()
        }
      }

      // Monitor writeError for failure
      const checkError = () => {
        if (writeError && !resolved) {
          resolved = true
          clearTimeout(timeoutId)
          console.error(`❌ ${isApproval ? "Approval" : "Purchase"} error:`, writeError)
          reject(writeError)
        }
      }

      try {
        // Execute the contract call
        contractCall()

        // Start monitoring (we'll check every 500ms)
        const monitorInterval = setInterval(() => {
          if (resolved) {
            clearInterval(monitorInterval)
            return
          }
          checkSuccess()
          checkError()
        }, 500)

        // Clean up interval when resolved
        setTimeout(() => clearInterval(monitorInterval), timeoutMs + 1000)
      } catch (error) {
        if (!resolved) {
          resolved = true
          clearTimeout(timeoutId)
          reject(error)
        }
      }
    })
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

    try {
      console.log("🔄 Starting approval with timeout handling...")

      // For WalletConnect after failed attempts, use direct wallet interaction
      if (connector?.type === "walletConnect" && (retryCount > 0 || useDirectWallet)) {
        console.log("🔗 Using direct wallet interaction for WalletConnect approval")

        try {
          const hash = await executeDirectWalletTransaction(
            purchaseState.selectedToken.address,
            ERC20_ABI,
            "approve",
            [VENDING_MACHINE_ADDRESS, approvalAmount],
            true,
          )

          setPurchaseState((prev) => ({ ...prev, txHash: hash }))
          toast.success(`Approval transaction sent! Hash: ${hash.slice(0, 10)}...`)
          setRetryCount(0)
          setUseDirectWallet(false)
          return
        } catch (directError: any) {
          console.error("❌ Direct wallet approval failed:", directError)

          let errorMessage = "Direct wallet approval failed"
          if (directError.message?.includes("rejected")) {
            errorMessage = "Approval was rejected by user"
          } else if (directError.message?.includes("insufficient funds")) {
            errorMessage = "Insufficient funds for gas"
          }

          setPurchaseState((prev) => ({
            ...prev,
            error: errorMessage,
            isApproving: false,
          }))
          toast.error(errorMessage)
          setRetryCount(0)
          setUseDirectWallet(false)
          return
        }
      }

      // Try wagmi writeContract first (for first attempt or non-WalletConnect)
      await executeWithTimeout(
        () => {
          console.log("📝 Calling writeContract for approval...")
          writeContract({
            address: purchaseState.selectedToken!.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [VENDING_MACHINE_ADDRESS, approvalAmount],
            chainId: gnosis.id,
          })
        },
        true,
        25000, // 25 second timeout for first attempt
      )

      console.log("✅ Approval transaction initiated successfully")
    } catch (error: any) {
      console.error("❌ Approval failed:", error)

      let errorMessage = "Approval failed"

      if (error.message?.includes("timeout")) {
        errorMessage = "Approval timed out. Please check your wallet app and try again."

        // For WalletConnect timeouts, switch to direct wallet interaction
        if (connector?.type === "walletConnect" && retryCount < 2) {
          console.log(`🔄 WalletConnect approval timeout. Switching to direct wallet interaction...`)
          setRetryCount((prev) => prev + 1)
          setUseDirectWallet(true)
          toast.error(`Approval timeout. Trying direct wallet connection... (${retryCount + 1}/2)`)

          setTimeout(() => {
            retryApproval()
          }, 2000)
          return
        }
      } else if (error.message?.includes("rejected")) {
        errorMessage = "Approval was rejected by user"
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas"
      }

      setPurchaseState((prev) => ({
        ...prev,
        error: errorMessage,
        isApproving: false,
      }))
      toast.error(errorMessage)
      setRetryCount(0)
      setUseDirectWallet(false)
    }
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

    try {
      console.log("🔄 Starting purchase with timeout handling...")

      // For WalletConnect after failed attempts, use direct wallet interaction
      if (connector?.type === "walletConnect" && (retryCount > 0 || useDirectWallet)) {
        console.log("🔗 Using direct wallet interaction for WalletConnect purchase")

        try {
          const hash = await executeDirectWalletTransaction(
            VENDING_MACHINE_ADDRESS,
            VENDING_MACHINE_ABI,
            "vendFromTrack",
            [purchaseState.selectedTrack.trackId, purchaseState.selectedToken.address, address],
            false,
          )

          setPurchaseState((prev) => ({ ...prev, txHash: hash }))
          toast.success(`Purchase transaction sent! Hash: ${hash.slice(0, 10)}...`)
          setRetryCount(0)
          setUseDirectWallet(false)
          return
        } catch (directError: any) {
          console.error("❌ Direct wallet interaction failed:", directError)

          let errorMessage = "Direct wallet purchase failed"
          if (directError.message?.includes("rejected")) {
            errorMessage = "Purchase was rejected by user"
          } else if (directError.message?.includes("insufficient funds")) {
            errorMessage = "Insufficient funds for gas"
          }

          setPurchaseState((prev) => ({
            ...prev,
            error: errorMessage,
            isPurchasing: false,
          }))
          toast.error(errorMessage)
          setRetryCount(0)
          setUseDirectWallet(false)
          return
        }
      }

      // Try wagmi writeContract first (for first attempt or non-WalletConnect)
      await executeWithTimeout(
        () => {
          console.log("🛒 Calling writeContract for purchase...")
          writeContract({
            address: VENDING_MACHINE_ADDRESS,
            abi: VENDING_MACHINE_ABI,
            functionName: "vendFromTrack",
            args: [
              purchaseState.selectedTrack!.trackId,
              purchaseState.selectedToken!.address as `0x${string}`,
              address,
            ],
            chainId: gnosis.id,
          })
        },
        false,
        25000, // 25 second timeout for first attempt
      )

      console.log("✅ Purchase transaction initiated successfully")
    } catch (error: any) {
      console.error("❌ Purchase failed:", error)

      let errorMessage = "Purchase failed"

      if (error.message?.includes("timeout")) {
        errorMessage = "Purchase timed out. Please check your wallet app and try again."

        // For WalletConnect timeouts, switch to direct wallet interaction
        if (connector?.type === "walletConnect" && retryCount < 2) {
          console.log(`🔄 WalletConnect purchase timeout. Switching to direct wallet interaction...`)
          setRetryCount((prev) => prev + 1)
          setUseDirectWallet(true)
          toast.error(`Purchase timeout. Trying direct wallet connection... (${retryCount + 1}/2)`)

          setTimeout(() => {
            retryPurchase()
          }, 2000)
          return
        }
      } else if (error.message?.includes("rejected")) {
        errorMessage = "Purchase was rejected by user"
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas"
      }

      setPurchaseState((prev) => ({
        ...prev,
        error: errorMessage,
        isPurchasing: false,
      }))
      toast.error(errorMessage)
      setRetryCount(0)
      setUseDirectWallet(false)
    }
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
    setUseDirectWallet(false)
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
