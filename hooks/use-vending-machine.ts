"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId } from "wagmi"
import { readContract } from "@wagmi/core"
import { config } from "@/lib/web3/config"
import { vendingMachineAbi } from "@/lib/contracts/vending-machine-abi"
import { erc20Abi } from "@/lib/contracts/erc20-abi"
import { gnosis } from "wagmi/chains"
import type { Track, TokenInfo, MachineInfo } from "@/lib/types/vending-machine"

const VENDING_MACHINE_ADDRESS = process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS as `0x${string}`

export function useVendingMachine() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [tracks, setTracks] = useState<Track[]>([])
  const [acceptedTokens, setAcceptedTokens] = useState<TokenInfo[]>([])
  const [machineInfo, setMachineInfo] = useState<MachineInfo | null>(null)
  const [voteTokenAddress, setVoteTokenAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isCorrectNetwork = chainId === gnosis.id

  const fetchVendingMachineData = async () => {
    if (!isCorrectNetwork || !VENDING_MACHINE_ADDRESS) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch tracks
      const tracksResult = await readContract(config, {
        address: VENDING_MACHINE_ADDRESS,
        abi: vendingMachineAbi,
        functionName: "getAllTracks",
      })

      // Fetch accepted tokens
      const tokensResult = await readContract(config, {
        address: VENDING_MACHINE_ADDRESS,
        abi: vendingMachineAbi,
        functionName: "getAcceptedTokens",
      })

      // Fetch vote token
      const voteTokenResult = await readContract(config, {
        address: VENDING_MACHINE_ADDRESS,
        abi: vendingMachineAbi,
        functionName: "voteToken",
      })

      // Process tracks
      const processedTracks = tracksResult.map((track: any) => ({
        trackId: track.trackId,
        product: {
          name: track.product.name,
          imageURI: track.product.imageURI,
        },
        price: track.price,
        stock: track.stock,
      }))

      // Process tokens with balances and metadata
      const processedTokens: TokenInfo[] = []

      for (const tokenAddress of tokensResult) {
        try {
          // Fetch token metadata
          const [symbol, decimals, balance] = await Promise.all([
            readContract(config, {
              address: tokenAddress,
              abi: erc20Abi,
              functionName: "symbol",
            }),
            readContract(config, {
              address: tokenAddress,
              abi: erc20Abi,
              functionName: "decimals",
            }),
            address
              ? readContract(config, {
                  address: tokenAddress,
                  abi: erc20Abi,
                  functionName: "balanceOf",
                  args: [address],
                })
              : 0n,
          ])

          processedTokens.push({
            address: tokenAddress,
            symbol: symbol as string,
            decimals: decimals as number,
            balance: balance as bigint,
          })
        } catch (tokenError) {
          console.error(`Error fetching token data for ${tokenAddress}:`, tokenError)
        }
      }

      setTracks(processedTracks)
      setAcceptedTokens(processedTokens)
      setVoteTokenAddress(voteTokenResult as string)
      setMachineInfo({
        totalTracks: processedTracks.length,
        totalProducts: processedTracks.filter((track) => track.stock > 0n).length,
        acceptedTokensCount: processedTokens.length,
      })
    } catch (err) {
      console.error("Error fetching vending machine data:", err)
      setError("Failed to load vending machine data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendingMachineData()
  }, [isCorrectNetwork, address])

  return {
    tracks,
    acceptedTokens,
    machineInfo,
    voteTokenAddress,
    loading,
    error,
    refetchTracks: fetchVendingMachineData,
  }
}
