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

export interface MachineInfo {
  totalTracks: number
  activeTracks: number
  totalRevenue: bigint
  totalSales: number
}
