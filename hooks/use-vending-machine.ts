"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useReadContracts } from "wagmi"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { ERC20_ABI } from "@/lib/contracts/erc20-abi"
import { VENDING_MACHINE_ADDRESS } from "@/lib/web3/config"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

export function useVendingMachine() {
  const { address, isConnected } = useAccount()
  const [tracks, setTracks] = useState<Track[]>([])
  const [acceptedTokens, setAcceptedTokens] = useState<TokenInfo[]>([])
  const [loading, setLoading] = useState(true)

  // Get all tracks
  const { data: tracksData, refetch: refetchTracks } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getAllTracks",
  })

  // Get accepted tokens
  const { data: acceptedTokenAddresses } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getAcceptedTokens",
  })

  // Get token info for accepted tokens
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

  const { data: tokenData } = useReadContracts({
    contracts: tokenContracts,
  })

  useEffect(() => {
    if (tracksData) {
      const formattedTracks = tracksData.map((track) => ({
        trackId: Number(track.trackId),
        product: track.product,
        price: track.price,
        stock: track.stock,
      }))
      setTracks(formattedTracks)
    }
  }, [tracksData])

  useEffect(() => {
    if (acceptedTokenAddresses && tokenData) {
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

      setAcceptedTokens(tokens)
    }
    setLoading(false)
  }, [acceptedTokenAddresses, tokenData, isConnected, address])

  return {
    tracks,
    acceptedTokens,
    loading,
    refetchTracks,
  }
}
