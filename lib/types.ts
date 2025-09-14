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
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
  isCorrectNetwork: boolean
}
