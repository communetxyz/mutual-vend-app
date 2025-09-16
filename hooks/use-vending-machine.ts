"use client"

import { useReadContract } from "wagmi"
import { VENDING_MACHINE_ABI } from "@/lib/contracts"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

export function useVendingMachine() {
  // Get accepted tokens
  const { data: acceptedTokens } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getAcceptedTokens",
  })

  // Get tracks (simplified - in real app would get multiple tracks)
  const { data: trackData } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getTrack",
    args: [0n], // Track 0
  })

  // Mock data for demo
  const tracks: Track[] = trackData
    ? [trackData as Track]
    : [
        {
          trackId: 0n,
          price: 1000000000000000000n, // 1 token
          stock: 5n,
          product: {
            name: "Crypto Snack",
            imageURI: "/placeholder.svg?height=200&width=200",
          },
        },
      ]

  const tokens: TokenInfo[] = [
    {
      address: "0x1234567890123456789012345678901234567890",
      symbol: "USDC",
      decimals: 6,
      balance: 1000000000n, // 1000 USDC
    },
  ]

  return {
    tracks,
    acceptedTokens: tokens,
    isLoading: false,
    error: null,
  }
}
