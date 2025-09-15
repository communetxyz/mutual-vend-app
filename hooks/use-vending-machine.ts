"use client"

import { useState, useEffect } from "react"
import { useReadContract, useAccount, useChainId } from "wagmi"
import { gnosis } from "wagmi/chains"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import type { Track, TokenInfo, MachineStats } from "@/lib/types/vending-machine"

// Common ERC20 tokens on Gnosis Chain
const SUPPORTED_TOKENS = [
  {
    address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d" as const, // WXDAI
    name: "Wrapped XDAI",
    symbol: "WXDAI",
    decimals: 18,
  },
  {
    address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83" as const, // USDC
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
  },
  {
    address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6" as const, // USDT
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
  },
]

export function useVendingMachine() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [tracks, setTracks] = useState<Track[]>([])
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get machine stats
  const { data: machineStats } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getMachineStats",
    chainId: gnosis.id,
    query: {
      enabled: chainId === gnosis.id,
    },
  }) as { data: [number, number, bigint, bigint] | undefined }

  // Get total number of tracks
  const { data: trackCount } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getTrackCount",
    chainId: gnosis.id,
    query: {
      enabled: chainId === gnosis.id,
    },
  }) as { data: bigint | undefined }

  // Fetch track details
  useEffect(() => {
    async function fetchTracks() {
      if (!trackCount || chainId !== gnosis.id) return

      setIsLoading(true)
      const trackPromises = []

      for (let i = 0; i < Number(trackCount); i++) {
        trackPromises.push(
          fetch(`/api/track/${i}`)
            .then((res) => res.json())
            .catch(() => null),
        )
      }

      try {
        const trackResults = await Promise.all(trackPromises)
        const validTracks = trackResults.filter(Boolean).map((track, index) => ({
          trackId: BigInt(index),
          name: track.name || `Track ${index + 1}`,
          price: BigInt(track.price || "1000000000000000000"), // 1 token default
          stock: BigInt(track.stock || "10"),
          isActive: track.isActive !== false,
        }))

        setTracks(validTracks)
      } catch (error) {
        console.error("Error fetching tracks:", error)
        // Fallback to mock data
        setTracks([
          {
            trackId: 0n,
            name: "Coca Cola",
            price: 2000000000000000000n, // 2 tokens
            stock: 15n,
            isActive: true,
          },
          {
            trackId: 1n,
            name: "Pepsi",
            price: 2000000000000000000n, // 2 tokens
            stock: 12n,
            isActive: true,
          },
          {
            trackId: 2n,
            name: "Water",
            price: 1500000000000000000n, // 1.5 tokens
            stock: 20n,
            isActive: true,
          },
          {
            trackId: 3n,
            name: "Chips",
            price: 3000000000000000000n, // 3 tokens
            stock: 8n,
            isActive: true,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTracks()
  }, [trackCount, chainId])

  // Fetch token balances
  useEffect(() => {
    async function fetchTokenBalances() {
      if (!address || chainId !== gnosis.id) {
        setTokens([])
        return
      }

      const tokenPromises = SUPPORTED_TOKENS.map(async (token) => {
        try {
          const response = await fetch(`/api/token-balance?address=${address}&token=${token.address}`)
          const data = await response.json()

          return {
            ...token,
            balance: BigInt(data.balance || "0"),
          }
        } catch (error) {
          console.error(`Error fetching balance for ${token.symbol}:`, error)
          return {
            ...token,
            balance: 0n,
          }
        }
      })

      try {
        const tokenResults = await Promise.all(tokenPromises)
        setTokens(tokenResults)
      } catch (error) {
        console.error("Error fetching token balances:", error)
        setTokens(SUPPORTED_TOKENS.map((token) => ({ ...token, balance: 0n })))
      }
    }

    fetchTokenBalances()
  }, [address, chainId])

  const stats: MachineStats = machineStats
    ? {
        totalTracks: machineStats[0],
        activeTracks: machineStats[1],
        totalRevenue: machineStats[2],
        totalSales: machineStats[3],
      }
    : {
        totalTracks: tracks.length,
        activeTracks: tracks.filter((t) => t.isActive).length,
        totalRevenue: 0n,
        totalSales: 0n,
      }

  return {
    tracks: tracks.filter((track) => track.isActive),
    tokens,
    stats,
    isLoading,
    isCorrectNetwork: chainId === gnosis.id,
  }
}
