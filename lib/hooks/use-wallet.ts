"use client"

import { useState, useEffect, useCallback } from "react"
import { WalletService } from "@/lib/services/wallet-service"
import { CHAIN_ID } from "@/lib/config"

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletService] = useState(() => new WalletService())

  // Only Gnosis Chain is supported
  const isCorrectNetwork = chainId === CHAIN_ID

  const checkConnection = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return

    try {
      const provider = walletService.getProvider()
      if (!provider) return

      const accounts = await provider.listAccounts()
      if (accounts.length > 0) {
        const network = await provider.getNetwork()
        setIsConnected(true)
        setAddress(accounts[0].address)
        setChainId(Number(network.chainId))
      }
    } catch (error) {
      console.error("Failed to check wallet connection:", error)
    }
  }, [walletService])

  const connectWallet = useCallback(async () => {
    if (isConnecting) return

    setIsConnecting(true)
    setError(null)

    try {
      const { address: walletAddress, chainId: walletChainId } = await walletService.connect()
      setIsConnected(true)
      setAddress(walletAddress)
      setChainId(walletChainId)
    } catch (error: any) {
      setError(error.message)
      console.error("Wallet connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }, [walletService, isConnecting])

  const switchNetwork = useCallback(async () => {
    if (isSwitching) return

    setIsSwitching(true)
    setError(null)

    try {
      await walletService.switchToGnosisChain()
      // Network change will be detected by event listener
    } catch (error: any) {
      if (error.code !== 4001) {
        // User didn't reject
        setError(error.message || "Failed to switch to Gnosis Chain")
      }
    } finally {
      setIsSwitching(false)
    }
  }, [walletService, isSwitching])

  const disconnectWallet = useCallback(() => {
    walletService.disconnect()
    setIsConnected(false)
    setAddress(null)
    setChainId(null)
    setError(null)
  }, [walletService])

  // Set up event listeners
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        setAddress(accounts[0])
      }
    }

    const handleChainChanged = (chainId: string) => {
      setChainId(Number.parseInt(chainId, 16))
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    // Initial connection check
    checkConnection()

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum?.removeListener("chainChanged", handleChainChanged)
    }
  }, [checkConnection, disconnectWallet])

  return {
    isConnected,
    address,
    chainId,
    isCorrectNetwork,
    isConnecting,
    isSwitching,
    error,
    walletService,
    connectWallet,
    switchNetwork,
    disconnectWallet,
  }
}
