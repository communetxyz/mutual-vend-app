import { ethers } from "ethers"
import { GNOSIS_CHAIN_CONFIG, CHAIN_ID } from "@/lib/config"

export class WalletService {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null

  async connect(): Promise<{ address: string; chainId: number }> {
    if (typeof window === "undefined") {
      throw new Error("Window not available")
    }

    // Handle multiple wallet extensions
    let ethereum = window.ethereum

    // If multiple wallets, try to use MetaMask specifically
    if (window.ethereum?.providers?.length > 0) {
      ethereum = window.ethereum.providers.find((provider: any) => provider.isMetaMask) || window.ethereum.providers[0]
    }

    if (!ethereum) {
      throw new Error("No Ethereum wallet found. Please install MetaMask.")
    }

    try {
      this.provider = new ethers.BrowserProvider(ethereum)

      // Request account access
      await this.provider.send("eth_requestAccounts", [])

      // Get signer and address
      this.signer = await this.provider.getSigner()
      const address = await this.signer.getAddress()

      // Get current network
      const network = await this.provider.getNetwork()
      const chainId = Number(network.chainId)

      return { address, chainId }
    } catch (error: any) {
      console.error("Wallet connection failed:", error)
      throw new Error(error.message || "Failed to connect wallet")
    }
  }

  async switchToGnosisChain(): Promise<void> {
    if (typeof window === "undefined") {
      throw new Error("Window not available")
    }

    let ethereum = window.ethereum

    // Handle multiple wallet extensions
    if (window.ethereum?.providers?.length > 0) {
      ethereum = window.ethereum.providers.find((provider: any) => provider.isMetaMask) || window.ethereum.providers[0]
    }

    if (!ethereum) {
      throw new Error("MetaMask not available")
    }

    try {
      // Try to switch to Gnosis Chain
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }], // 0x64 for chain ID 100
      })
    } catch (switchError: any) {
      // If chain doesn't exist, add it
      if (switchError.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${CHAIN_ID.toString(16)}`,
              chainName: GNOSIS_CHAIN_CONFIG.chainName,
              nativeCurrency: GNOSIS_CHAIN_CONFIG.nativeCurrency,
              rpcUrls: GNOSIS_CHAIN_CONFIG.rpcUrls,
              blockExplorerUrls: GNOSIS_CHAIN_CONFIG.blockExplorerUrls,
            },
          ],
        })
      } else {
        throw switchError
      }
    }
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider
  }

  disconnect(): void {
    this.provider = null
    this.signer = null
  }

  async estimateGas(transaction: any): Promise<bigint> {
    if (!this.provider) throw new Error("Provider not available")

    try {
      const gasEstimate = await this.provider.estimateGas(transaction)
      // Add 20% buffer
      return (gasEstimate * BigInt(120)) / BigInt(100)
    } catch (error) {
      console.error("Gas estimation failed:", error)
      // Fallback gas limit for Gnosis Chain
      return BigInt(300000)
    }
  }
}

declare global {
  interface Window {
    ethereum?: any
  }
}
