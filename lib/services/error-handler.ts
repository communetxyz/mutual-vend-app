export class VendingMachineError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public recoverable = true,
  ) {
    super(message)
    this.name = "VendingMachineError"
  }
}

export class ErrorHandler {
  static handleContractError(error: any): VendingMachineError {
    console.error("Contract error:", error)

    // Parse common contract errors
    if (error.reason) {
      switch (error.reason) {
        case "InsufficientStock":
          return new VendingMachineError(
            "Insufficient stock",
            "INSUFFICIENT_STOCK",
            "This item is out of stock. Please try another product.",
            false,
          )
        case "TokenNotAccepted":
          return new VendingMachineError(
            "Token not accepted",
            "TOKEN_NOT_ACCEPTED",
            "This payment token is not accepted by the vending machine.",
            false,
          )
        case "PriceNotSet":
          return new VendingMachineError(
            "Price not set",
            "PRICE_NOT_SET",
            "The price for this item has not been set yet. Please try again later.",
            false,
          )
        case "InsufficientBalance":
          return new VendingMachineError(
            "Insufficient balance",
            "INSUFFICIENT_BALANCE",
            "You don't have enough tokens to purchase this item.",
            true,
          )
        case "InvalidTrackId":
          return new VendingMachineError(
            "Invalid track ID",
            "INVALID_TRACK",
            "The selected product is not available.",
            false,
          )
      }
    }

    // Parse user rejection
    if (error.code === 4001 || error.message?.includes("User denied")) {
      return new VendingMachineError(
        "Transaction rejected",
        "USER_REJECTED",
        "Transaction was cancelled by user.",
        true,
      )
    }

    // Parse network errors
    if (error.code === "NETWORK_ERROR" || error.message?.includes("network")) {
      return new VendingMachineError(
        "Network error",
        "NETWORK_ERROR",
        "Network connection failed. Please check your internet connection and try again.",
        true,
      )
    }

    // Parse gas errors
    if (error.message?.includes("gas") || error.code === "UNPREDICTABLE_GAS_LIMIT") {
      return new VendingMachineError(
        "Gas estimation failed",
        "GAS_ERROR",
        "Transaction failed due to gas issues. Please try again with higher gas settings.",
        true,
      )
    }

    // Generic error
    return new VendingMachineError(
      error.message || "Unknown error",
      "UNKNOWN_ERROR",
      "An unexpected error occurred. Please try again.",
      true,
    )
  }

  static handleWalletError(error: any): VendingMachineError {
    console.error("Wallet error:", error)

    if (error.code === 4001) {
      return new VendingMachineError(
        "User rejected request",
        "USER_REJECTED",
        "Connection request was cancelled.",
        true,
      )
    }

    if (error.code === 4902) {
      return new VendingMachineError(
        "Network not added",
        "NETWORK_NOT_ADDED",
        "Please add Gnosis Chain to your wallet.",
        true,
      )
    }

    if (error.message?.includes("MetaMask")) {
      return new VendingMachineError(
        "MetaMask not found",
        "WALLET_NOT_FOUND",
        "Please install MetaMask or another Web3 wallet.",
        false,
      )
    }

    return new VendingMachineError(
      error.message || "Wallet error",
      "WALLET_ERROR",
      "Wallet connection failed. Please try again.",
      true,
    )
  }
}
