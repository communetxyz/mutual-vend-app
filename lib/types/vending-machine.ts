export interface Product {
  name: string
  imageURI: string
}

export interface Track {
  trackId: bigint
  product: Product
  price: bigint
  stock: bigint
}

export interface TokenInfo {
  address: string
  symbol: string
  decimals: number
  balance: bigint
}

export interface MachineInfo {
  totalTracks: number
  totalProducts: number
  acceptedTokensCount: number
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
