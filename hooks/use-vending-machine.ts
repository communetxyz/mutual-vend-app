"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useReadContracts } from "wagmi"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { ERC20_ABI } from "@/lib/contracts/erc20-abi"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import { BREAD_TOKEN } from "@/lib/citizen-wallet/config"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

export function useVendingMachine() {
  const { address, isConnected } = useAccount()
  const [tracks, setTracks] = useState<Track[]>([])
  const [acceptedTokens, setAcceptedTokens] = useState<TokenInfo[]>([])
  const [machineInfo, setMachineInfo] = useState({
    numTracks: 0,
    maxStockPerTrack: 0n,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get machine configuration
  const { data: numTracks } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "NUM_TRACKS",
  })

  const { data: maxStockPerTrack } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "MAX_STOCK_PER_TRACK",
  })

  // Get all tracks - this is the main inventory getter
  const {
    data: tracksData,
    refetch: refetchTracks,
    error: tracksError,
    isLoading: tracksLoading,
  } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getAllTracks",
  })

  // Get accepted tokens
  const { data: acceptedTokenAddresses, error: tokensError } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getAcceptedTokens",
  })

  // Get vote token address for rewards info
  const { data: voteTokenAddress } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "voteToken",
  })

  // Get token info for accepted tokens (including BREAD)
  const tokenContracts =
    acceptedTokenAddresses?.flatMap((tokenAddress) => [
      {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "name",
      },
      {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "symbol",
      },
      {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      },
      ...(isConnected && address
        ? [
            {
              address: tokenAddress,
              abi: ERC20_ABI,
              functionName: "balanceOf",
              args: [address],
            },
          ]
        : []),
    ]) || []

  const { data: tokenData, error: tokenDataError } = useReadContracts({
    contracts: tokenContracts,
  })

  // Update machine info
  useEffect(() => {
    if (numTracks !== undefined && maxStockPerTrack !== undefined) {
      setMachineInfo({
        numTracks: Number(numTracks),
        maxStockPerTrack,
      })
    }
  }, [numTracks, maxStockPerTrack])

  // Process tracks data
  useEffect(() => {
    if (tracksData) {
      try {
        const formattedTracks = tracksData
          .map((track) => ({
            trackId: Number(track.trackId),
            product: {
              name: track.product.name || `Product ${track.trackId}`,
              imageURI: track.product.imageURI || "",
            },
            price: track.price,
            stock: track.stock,
          }))
          .filter(
            (track) =>
              // Only show tracks that have been configured (have a name or price > 0)
              track.product.name.trim() !== "" || track.price > 0n,
          )
          .sort((a, b) => a.trackId - b.trackId) // Sort by track ID

        setTracks(formattedTracks)
        setError(null)
      } catch (err) {
        console.error("Error processing tracks data:", err)
        setError("Failed to process inventory data")
      }
    }
  }, [tracksData])

  // Process token data (including BREAD token)
  useEffect(() => {
    if (acceptedTokenAddresses && tokenData) {
      try {
        const tokens: TokenInfo[] = []

        acceptedTokenAddresses.forEach((tokenAddress, index) => {
          const baseIndex = index * (isConnected && address ? 4 : 3)
          const nameResult = tokenData[baseIndex]
          const symbolResult = tokenData[baseIndex + 1]
          const decimalsResult = tokenData[baseIndex + 2]
          const balanceResult = isConnected && address ? tokenData[baseIndex + 3] : null

          if (
            nameResult?.status === "success" &&
            symbolResult?.status === "success" &&
            decimalsResult?.status === "success"
          ) {
            tokens.push({
              address: tokenAddress,
              name: nameResult.result as string,
              symbol: symbolResult.result as string,
              decimals: decimalsResult.result as number,
              balance: balanceResult?.status === "success" ? (balanceResult.result as bigint) : 0n,
            })
          }
        })

        // Add BREAD token if not already included
        const breadTokenExists = tokens.some(
          (token) => token.address.toLowerCase() === BREAD_TOKEN.address.toLowerCase(),
        )
        if (!breadTokenExists) {
          tokens.push({
            address: BREAD_TOKEN.address,
            name: BREAD_TOKEN.name,
            symbol: BREAD_TOKEN.symbol,
            decimals: BREAD_TOKEN.decimals,
            balance: 0n, // BREAD balance will be managed by Citizen Wallet
          })
        }

        setAcceptedTokens(tokens)
        setError(null)
      } catch (err) {
        console.error("Error processing token data:", err)
        setError("Failed to process payment token data")
      }
    }
  }, [acceptedTokenAddresses, tokenData, isConnected, address])

  // Handle loading state
  useEffect(() => {
    if (!tracksLoading) {
      setLoading(false)
    }
  }, [tracksLoading])

  // Handle errors
  useEffect(() => {
    if (tracksError || tokensError || tokenDataError) {
      const errorMessage = tracksError?.message || tokensError?.message || tokenDataError?.message || "Unknown error"
      setError(`Contract error: ${errorMessage}`)
      setLoading(false)
    }
  }, [tracksError, tokensError, tokenDataError])

  // Get individual track inventory (useful for real-time updates)
  const getTrackInventory = async (trackId: number) => {
    try {
      // This would be used for individual track inventory checks
      // Currently handled by getAllTracks, but available for granular updates
      return tracks.find((track) => track.trackId === trackId)?.stock || 0n
    } catch (err) {
      console.error(`Error getting inventory for track ${trackId}:`, err)
      return 0n
    }
  }

  return {
    tracks,
    acceptedTokens,
    machineInfo,
    voteTokenAddress,
    loading,
    error,
    refetchTracks,
    getTrackInventory,
  }
}
