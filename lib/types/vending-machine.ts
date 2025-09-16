export interface Product {
  name: string
  imageURI: string
}

export interface Track {
  trackId: bigint
  price: bigint
  stock: bigint
  product: Product
}

export interface TokenInfo {
  address: string
  symbol: string
  decimals: number
  balance: bigint
}

export interface PurchaseState {
  selectedTrack: Track | null
  selectedToken: TokenInfo | null
  isApproving: boolean
  isPurchasing: boolean
  txHash: string | null
  error: string | null
  step: "idle" | "approving" | "purchasing" | "completed"
}
