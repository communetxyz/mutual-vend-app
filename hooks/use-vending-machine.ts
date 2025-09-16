"use client"

import { useState, useEffect } from "react"
import { useReadContract, useChainId } from "wagmi"
import { gnosis } from "wagmi/chains"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import { BREAD_TOKEN } from "@/lib/contracts"
import type { Track, TokenInfo, MachineInfo } from "@/lib/types/vending-machine"

export function useVendingMachine() {
  const chainId = useChainId()
  const [tracks, setTracks] = useState<Track[]>([])
  const [acceptedTokens, setAcceptedTokens] = useState<TokenInfo[]>([])
  const [machineInfo, setMachineInfo] = useState<MachineInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get all tracks
  const { data: tracksData, refetch: refetchTracksData } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getAllTracks",
    chainId: gnosis.id,
    query: {
      enabled: chainId === gnosis.id,
    },
  })

  // Get accepted tokens
  const { data: acceptedTokensData } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getAcceptedTokens",
    chainId: gnosis.id,
    query: {
      enabled: chainId === gnosis.id,
    },
  })

  // Get vote token address
  const { data: voteTokenAddress } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "voteToken",
    chainId: gnosis.id,
    query: {
      enabled: chainId === gnosis.id,
    },
  })

  // Process tracks data
  useEffect(() => {
    if (tracksData) {
      try {
        const processedTracks = (tracksData as any[]).map((track) => ({
          trackId: Number(track.trackId),
          product: {
            name: track.product.name,
            imageURI: track.product.imageURI,
          },
          price: track.price,
          stock: track.stock,
        }))
        setTracks(processedTracks)
        setError(null)
      } catch (err) {
        console.error("Error processing tracks data:", err)
        setError("Failed to process tracks data")
      }
    }
  }, [tracksData])

  // Process accepted tokens data
  useEffect(() => {
    const processTokens = async () => {
      if (acceptedTokensData && chainId === gnosis.id) {
        try {
          const tokenPromises = (acceptedTokensData as string[]).map(async (tokenAddress) => {
            // For now, we'll use mock data for token info
            // In a real implementation, you'd fetch this from the token contracts
            const mockTokens: { [key: string]: Omit<TokenInfo, "balance"> } = {
              "0x4ECaBa5870353805a9F068101A40E0f32ed605C6": {
                address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
                symbol: "USDT",
                decimals: 6,
              },
              "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83": {
                address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
                symbol: "USDC",
                decimals: 6,
              },
              [BREAD_TOKEN.address]: {
                address: BREAD_TOKEN.address,
                symbol: BREAD_TOKEN.symbol,
                decimals: BREAD_TOKEN.decimals,
              },
            }

            const tokenInfo = mockTokens[tokenAddress]
            if (tokenInfo) {
              return {
                ...tokenInfo,
                balance: 0n, // Will be updated when user connects wallet
              }
            }

            return {
              address: tokenAddress,
              symbol: "UNKNOWN",
              decimals: 18,
              balance: 0n,
            }
          })

          const tokens = await Promise.all(tokenPromises)
          setAcceptedTokens(tokens)
          setError(null)
        } catch (err) {
          console.error("Error processing tokens data:", err)
          setError("Failed to process tokens data")
        }
      }
    }

    processTokens()
  }, [acceptedTokensData, chainId])

  // Set loading state
  useEffect(() => {
    if (chainId === gnosis.id) {
      setLoading(!tracksData && !acceptedTokensData)
    } else {
      setLoading(false)
    }
  }, [tracksData, acceptedTokensData, chainId])

  const refetchTracks = () => {
    refetchTracksData()
  }

  return {
    tracks,
    acceptedTokens,
    machineInfo,
    voteTokenAddress,
    loading,
    error,
    refetchTracks,
  }
}
