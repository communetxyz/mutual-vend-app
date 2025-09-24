export interface Product {
  id: number
  name: string
  price: number
  inventory: number
  image: string
  description?: string
}

export interface Track {
  trackId: number
  product: {
    name: string
    imageURI: string
  }
  price: bigint
  stock: bigint
}

export interface VendingMachineState {
  tracks: Track[]
  isLoading: boolean
  error: string | null
}

export interface PurchaseState {
  isLoading: boolean
  error: string | null
  success: boolean
  txHash?: string
}

export interface TokenInfo {
  address: string
  name: string
  symbol: string
  decimals: number
  balance?: bigint
}

export interface VendingMachineConfig {
  contractAddress: string
  chainId: number
  acceptedTokens: TokenInfo[]
}
