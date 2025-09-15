export interface Track {
  trackId: bigint
  name: string
  price: bigint
  stock: bigint
  isActive: boolean
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

export interface MachineStats {
  totalTracks: number
  activeTracks: number
  totalRevenue: bigint
  totalSales: bigint
}
