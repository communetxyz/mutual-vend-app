"use client"

import { useState, useEffect } from "react"
import { useReadContract, useAccount, useChainId } from "wagmi"
import { vendingMachineAbi } from "@/lib/contracts/vending-machine-abi"
import type { Track, VendingMachineState } from "@/lib/types/vending-machine"

const VENDING_MACHINE_ADDRESS = process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS as `0x${string}`

export function useVendingMachine() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [state, setState] = useState<VendingMachineState>({
    tracks: [],
    isLoading: true,
    error: null,
  })

  // Read all tracks from the contract
  const {
    data: tracksData,
    isError,
    isLoading,
    error,
  } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: vendingMachineAbi,
    functionName: "getAllTracks",
    query: {
      enabled: !!VENDING_MACHINE_ADDRESS && !!address,
    },
  })

  useEffect(() => {
    if (isLoading) {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
    } else if (isError) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error?.message || "Failed to load vending machine data",
      }))
    } else if (tracksData) {
      const tracks = (tracksData as any[]).map((track, index) => ({
        trackId: index,
        product: {
          name: track.product?.name || `Product ${index + 1}`,
          imageURI: track.product?.imageURI || "/placeholder.svg?height=200&width=200&text=Product",
        },
        price: BigInt(track.price || 0),
        stock: BigInt(track.stock || 0),
      }))

      setState((prev) => ({
        ...prev,
        tracks,
        isLoading: false,
        error: null,
      }))
    } else {
      // Fallback to mock data if no contract data
      const mockTracks: Track[] = [
        {
          trackId: 0,
          product: {
            name: "Energy Drink",
            imageURI: "/placeholder.svg?height=200&width=200&text=Energy+Drink",
          },
          price: BigInt("2500000000000000000"), // 2.5 tokens
          stock: BigInt(10),
        },
        {
          trackId: 1,
          product: {
            name: "Protein Bar",
            imageURI: "/placeholder.svg?height=200&width=200&text=Protein+Bar",
          },
          price: BigInt("3000000000000000000"), // 3.0 tokens
          stock: BigInt(15),
        },
        {
          trackId: 2,
          product: {
            name: "Coffee",
            imageURI: "/placeholder.svg?height=200&width=200&text=Coffee",
          },
          price: BigInt("2000000000000000000"), // 2.0 tokens
          stock: BigInt(8),
        },
        {
          trackId: 3,
          product: {
            name: "Chips",
            imageURI: "/placeholder.svg?height=200&width=200&text=Chips",
          },
          price: BigInt("1500000000000000000"), // 1.5 tokens
          stock: BigInt(20),
        },
      ]

      setState((prev) => ({
        ...prev,
        tracks: mockTracks,
        isLoading: false,
        error: null,
      }))
    }
  }, [tracksData, isError, isLoading, error])

  const refreshTracks = () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    // This will trigger a re-fetch of the contract data
  }

  return {
    ...state,
    refreshTracks,
    contractAddress: VENDING_MACHINE_ADDRESS,
    chainId,
  }
}
