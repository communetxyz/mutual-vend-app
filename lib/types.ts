export interface Product {
  name: string
  imageURI: string
}

export interface Track {
  trackId: number
  product: Product
  price: bigint
  stock: bigint
}

export interface Token {
  address: string
  symbol: string
  decimals: number
  balance: bigint
}

export interface PurchaseState {
  isLoading: boolean
  error: string | null
  txHash: string | null
  step: "idle" | "checking-allowance" | "approving" | "purchasing" | "success" | "error"
  selectedTrackId?: number
  estimatedGas?: bigint
  gasPrice?: bigint
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
  isCorrectNetwork: boolean
}

export interface TransactionStatus {
  hash: string
  status: "pending" | "confirmed" | "failed"
  timestamp: number
  trackId?: number
  amount?: string
  voteTokensEarned?: string
  gasUsed?: string
  blockNumber?: number
}

export interface AppState {
  currentView: "disconnected" | "connecting" | "browsing" | "product-selected" | "purchasing" | "transaction-complete"
  selectedTrackId: number | null
  lastError: string | null
  sessionTransactions: TransactionStatus[]
}

export interface NetworkInfo {
  chainId: number
  name: string
  rpcUrl: string
  blockExplorer: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}
