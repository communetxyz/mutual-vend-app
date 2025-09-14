"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import type { WalletState } from "@/lib/types"

// Hardcoded Gnosis Chain configuration
const GNOSIS_CHAIN_ID = 100
const GNOSIS_CHAIN_HEX = "0x64" // 100 in hex

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    isCorrectNetwork: false,
  })

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)

  useEffect(() => {
    checkConnection()

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window === "undefined" || !window.ethereum) return

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.listAccounts()

      if (accounts.length > 0) {
        const network = await provider.getNetwork()
        const signer = await provider.getSigner()

        console.log("Current chain ID:", Number(network.chainId), "Expected: 100")

        setProvider(provider)
        setSigner(signer)
        setWalletState({
          isConnected: true,
          address: accounts[0].address,
          chainId: Number(network.chainId),
          isCorrectNetwork: Number(network.chainId) === GNOSIS_CHAIN_ID,
        })
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error)
    }
  }

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])

      // Don't immediately check network, let the connection complete first
      setTimeout(() => {
        checkConnection()
      }, 500)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  const switchNetwork = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not available")
    }

    try {
      console.log("Switching to Gnosis Chain...")

      // Try to switch to Gnosis Chain
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: GNOSIS_CHAIN_HEX }],
      })

      console.log("Switch request sent successfully")
    } catch (switchError: any) {
      console.error("Switch error:", switchError)

      // If the chain hasn't been added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          console.log("Adding Gnosis Chain to MetaMask...")

          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: GNOSIS_CHAIN_HEX,
                chainName: "Gnosis Chain",
                nativeCurrency: {
                  name: "xDAI",
                  symbol: "XDAI",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.gnosischain.com"],
                blockExplorerUrls: ["https://gnosisscan.io"],
              },
            ],
          })

          console.log("Gnosis Chain added successfully")
        } catch (addError: any) {
          console.error("Error adding network:", addError)
          throw new Error(`Failed to add Gnosis Chain: ${addError.message || "Unknown error"}`)
        }
      } else if (switchError.code === 4001) {
        // User rejected the request
        throw new Error("User rejected network switch request")
      } else {
        // Handle other errors
        throw new Error(`Failed to switch network: ${switchError.message || "Unknown error"}`)
      }
    }
  }

  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setWalletState({
      isConnected: false,
      address: null,
      chainId: null,
      isCorrectNetwork: false,
    })
  }

  const handleAccountsChanged = (accounts: string[]) => {
    console.log("Accounts changed:", accounts)
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      // Use setTimeout to avoid blocking the main thread
      setTimeout(() => {
        checkConnection()
      }, 100)
    }
  }

  const handleChainChanged = (chainId: string) => {
    console.log("Chain changed to:", chainId)
    // Use setTimeout to avoid blocking the main thread
    setTimeout(() => {
      checkConnection()
    }, 100)
  }

  return {
    ...walletState,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  }
}

declare global {
  interface Window {
    ethereum?: any
  }
}
