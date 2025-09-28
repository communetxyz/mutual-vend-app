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

export interface TokenInfo {
  address: string
  name: string
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
}
