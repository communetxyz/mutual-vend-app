import type { WalletService } from "./wallet-service"
import { ethers } from "ethers"

export class GasEstimator {
  constructor(private walletService: WalletService) {}

  async estimateGasForPurchase(
    contractAddress: string,
    trackId: number,
    tokenAddress: string,
    userAddress: string,
  ): Promise<{
    gasLimit: bigint
    gasPrice: bigint
    estimatedCost: bigint
  }> {
    const provider = this.walletService.getProvider()
    if (!provider) throw new Error("Provider not available")

    try {
      // Get current gas price
      const feeData = await provider.getFeeData()
      const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei")

      // Estimate gas for the transaction
      const gasLimit = await this.walletService.estimateGas({
        to: contractAddress,
        data: this.encodeVendFromTrack(trackId, tokenAddress, userAddress),
      })

      const estimatedCost = gasLimit * gasPrice

      return {
        gasLimit,
        gasPrice,
        estimatedCost,
      }
    } catch (error) {
      console.error("Gas estimation failed:", error)
      // Return fallback values
      return {
        gasLimit: BigInt(300000),
        gasPrice: ethers.parseUnits("20", "gwei"),
        estimatedCost: BigInt(300000) * ethers.parseUnits("20", "gwei"),
      }
    }
  }

  private encodeVendFromTrack(trackId: number, tokenAddress: string, userAddress: string): string {
    // This would normally use the contract interface to encode the function call
    // For now, return a placeholder
    return "0x"
  }

  async getCurrentGasPrice(): Promise<bigint> {
    const provider = this.walletService.getProvider()
    if (!provider) throw new Error("Provider not available")

    try {
      const feeData = await provider.getFeeData()
      return feeData.gasPrice || ethers.parseUnits("20", "gwei")
    } catch (error) {
      console.error("Failed to get gas price:", error)
      return ethers.parseUnits("20", "gwei")
    }
  }
}
