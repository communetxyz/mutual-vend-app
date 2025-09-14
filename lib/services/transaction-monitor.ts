import type { ContractService } from "./contract-service"
import type { TransactionStatus } from "@/lib/types"

export class TransactionMonitor {
  private contractService: ContractService
  private pendingTransactions: Map<string, TransactionStatus> = new Map()
  private listeners: Map<string, (status: TransactionStatus) => void> = new Map()

  constructor(contractService: ContractService) {
    this.contractService = contractService
  }

  watchTransaction(
    hash: string,
    trackId?: number,
    amount?: string,
    onUpdate?: (status: TransactionStatus) => void,
  ): void {
    const status: TransactionStatus = {
      hash,
      status: "pending",
      timestamp: Date.now(),
      trackId,
      amount,
    }

    this.pendingTransactions.set(hash, status)

    if (onUpdate) {
      this.listeners.set(hash, onUpdate)
    }

    // Start monitoring
    this.monitorTransaction(hash)
  }

  private async monitorTransaction(hash: string): Promise<void> {
    const maxAttempts = 60 // 2 minutes with 2-second intervals
    let attempts = 0

    const checkStatus = async () => {
      try {
        const receipt = await this.contractService.getTransactionReceipt(hash)
        const currentStatus = this.pendingTransactions.get(hash)

        if (!currentStatus) return // Transaction no longer being monitored

        if (receipt) {
          // Transaction confirmed
          const updatedStatus: TransactionStatus = {
            ...currentStatus,
            status: receipt.status === 1 ? "confirmed" : "failed",
          }

          // Parse events to get vote tokens earned
          if (receipt.status === 1) {
            try {
              // Look for vote token mint events or other relevant events
              updatedStatus.voteTokensEarned = currentStatus.amount // Simplified - in production, parse actual events
            } catch (error) {
              console.error("Failed to parse transaction events:", error)
            }
          }

          this.pendingTransactions.set(hash, updatedStatus)
          this.notifyListener(hash, updatedStatus)

          // Clean up
          setTimeout(() => {
            this.pendingTransactions.delete(hash)
            this.listeners.delete(hash)
          }, 30000) // Keep for 30 seconds after confirmation
        } else if (attempts < maxAttempts) {
          // Still pending, check again
          attempts++
          setTimeout(checkStatus, 2000)
        } else {
          // Timeout
          const timeoutStatus: TransactionStatus = {
            ...currentStatus,
            status: "failed",
          }

          this.pendingTransactions.set(hash, timeoutStatus)
          this.notifyListener(hash, timeoutStatus)
        }
      } catch (error) {
        console.error("Error monitoring transaction:", error)

        if (attempts < maxAttempts) {
          attempts++
          setTimeout(checkStatus, 2000)
        }
      }
    }

    checkStatus()
  }

  private notifyListener(hash: string, status: TransactionStatus): void {
    const listener = this.listeners.get(hash)
    if (listener) {
      listener(status)
    }
  }

  getTransactionStatus(hash: string): TransactionStatus | undefined {
    return this.pendingTransactions.get(hash)
  }

  getAllPendingTransactions(): TransactionStatus[] {
    return Array.from(this.pendingTransactions.values()).filter((tx) => tx.status === "pending")
  }

  stopWatching(hash: string): void {
    this.pendingTransactions.delete(hash)
    this.listeners.delete(hash)
  }
}
