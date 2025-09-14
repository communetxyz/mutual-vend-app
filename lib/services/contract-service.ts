import { ethers } from "ethers"
import type { WalletService } from "./wallet-service"
import { VENDING_MACHINE_ADDRESS, GNOSIS_RPC_URL, CONTRACT_SETTINGS } from "@/lib/config"
import type { Track, Token } from "@/lib/types"

// Import contract ABIs
import vendingMachineABI from "@/lib/contracts/vending-machine-abi.json"
import erc20ABI from "@/lib/contracts/erc20-abi.json"

export class ContractService {
  private provider: ethers.JsonRpcProvider
  private walletService: WalletService

  constructor(walletService: WalletService) {
    this.provider = new ethers.JsonRpcProvider(GNOSIS_RPC_URL)
    this.walletService = walletService
  }

  private getVendingMachineContract(withSigner = false) {
    const signerOrProvider = withSigner ? this.walletService.getSigner() || this.provider : this.provider

    return new ethers.Contract(VENDING_MACHINE_ADDRESS, vendingMachineABI, signerOrProvider)
  }

  private getTokenContract(address: string, withSigner = false) {
    const signerOrProvider = withSigner ? this.walletService.getSigner() || this.provider : this.provider

    return new ethers.Contract(address, erc20ABI, signerOrProvider)
  }

  async getAllTracks(): Promise<Track[]> {
    try {
      const contract = this.getVendingMachineContract()
      const tracksData = await contract.getAllTracks()

      return tracksData.map((track: any, index: number) => ({
        trackId: index,
        product: {
          name: track.product.name || `Product ${index + 1}`,
          imageURI: track.product.imageURI || `/placeholder.svg?height=200&width=200&text=Product+${index + 1}`,
        },
        price: track.price,
        stock: track.stock,
      }))
    } catch (error) {
      console.error("Failed to load tracks:", error)
      throw new Error("Failed to load product information")
    }
  }

  async getPaymentToken(): Promise<Token> {
    try {
      const contract = this.getVendingMachineContract()
      const acceptedTokens = await contract.getAcceptedTokens()

      if (acceptedTokens.length === 0) {
        throw new Error("No payment tokens configured")
      }

      // Use the first accepted token as primary payment token
      const tokenAddress = acceptedTokens[0]
      const tokenContract = this.getTokenContract(tokenAddress)

      const [symbol, decimals] = await Promise.all([tokenContract.symbol(), tokenContract.decimals()])

      return {
        address: tokenAddress,
        symbol,
        decimals: Number(decimals),
        balance: BigInt(0), // Will be loaded separately
      }
    } catch (error) {
      console.error("Failed to load payment token:", error)
      throw new Error("Failed to load payment token information")
    }
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<bigint> {
    try {
      const tokenContract = this.getTokenContract(tokenAddress)
      return await tokenContract.balanceOf(userAddress)
    } catch (error) {
      console.error("Failed to get token balance:", error)
      return BigInt(0)
    }
  }

  async getTokenAllowance(tokenAddress: string, userAddress: string): Promise<bigint> {
    try {
      const tokenContract = this.getTokenContract(tokenAddress)
      return await tokenContract.allowance(userAddress, VENDING_MACHINE_ADDRESS)
    } catch (error) {
      console.error("Failed to get token allowance:", error)
      return BigInt(0)
    }
  }

  async approveToken(tokenAddress: string, amount: bigint): Promise<string> {
    try {
      const tokenContract = this.getTokenContract(tokenAddress, true)

      // Estimate gas
      const gasLimit = await this.walletService.estimateGas({
        to: tokenAddress,
        data: tokenContract.interface.encodeFunctionData("approve", [VENDING_MACHINE_ADDRESS, amount]),
      })

      const tx = await tokenContract.approve(VENDING_MACHINE_ADDRESS, amount, {
        gasLimit,
      })

      return tx.hash
    } catch (error: any) {
      console.error("Token approval failed:", error)
      throw new Error(error.reason || error.message || "Token approval failed")
    }
  }

  async purchaseFromTrack(trackId: number, tokenAddress: string, userAddress: string): Promise<string> {
    try {
      const contract = this.getVendingMachineContract(true)

      // Estimate gas
      const gasLimit = await this.walletService.estimateGas({
        to: VENDING_MACHINE_ADDRESS,
        data: contract.interface.encodeFunctionData("vendFromTrack", [trackId, tokenAddress, userAddress]),
      })

      const tx = await contract.vendFromTrack(trackId, tokenAddress, userAddress, {
        gasLimit,
      })

      return tx.hash
    } catch (error: any) {
      console.error("Purchase failed:", error)
      throw new Error(error.reason || error.message || "Purchase transaction failed")
    }
  }

  async getVoteTokenAddress(): Promise<string> {
    try {
      const contract = this.getVendingMachineContract()
      return await contract.voteToken()
    } catch (error) {
      console.error("Failed to get vote token address:", error)
      return ""
    }
  }

  async waitForTransaction(txHash: string): Promise<ethers.TransactionReceipt> {
    try {
      const receipt = await this.provider.waitForTransaction(
        txHash,
        1, // confirmations
        CONTRACT_SETTINGS.transactionTimeout,
      )

      if (!receipt) {
        throw new Error("Transaction receipt not found")
      }

      return receipt
    } catch (error) {
      console.error("Transaction wait failed:", error)
      throw new Error("Transaction confirmation failed")
    }
  }

  async getTransactionReceipt(txHash: string): Promise<ethers.TransactionReceipt | null> {
    try {
      return await this.provider.getTransactionReceipt(txHash)
    } catch (error) {
      console.error("Failed to get transaction receipt:", error)
      return null
    }
  }

  // Check if contract exists at the configured address
  async checkContractExists(): Promise<boolean> {
    try {
      const code = await this.provider.getCode(VENDING_MACHINE_ADDRESS)
      return code !== "0x"
    } catch (error) {
      console.error("Failed to check contract existence:", error)
      return false
    }
  }
}
