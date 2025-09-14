"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { VENDING_MACHINE_ADDRESS, GNOSIS_RPC_URL } from "@/lib/config"
import vendingMachineAbi from "@/lib/contracts/vending-machine-abi.json"
import erc20Abi from "@/lib/contracts/erc20-abi.json"
import type { Track, Token, PurchaseState } from "@/lib/types"

export function useVendingMachine(signer: ethers.JsonRpcSigner | null, userAddress: string | null) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [acceptedTokens, setAcceptedTokens] = useState<Token[]>([])
  const [voteTokenAddress, setVoteTokenAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contractExists, setContractExists] = useState<boolean | null>(null)
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    isLoading: false,
    error: null,
    txHash: null,
    step: "idle",
  })

  // Create read-only provider for contract calls (using Gnosis Chain RPC)
  const provider = new ethers.JsonRpcProvider(GNOSIS_RPC_URL)
  const vendingMachineContract = new ethers.Contract(VENDING_MACHINE_ADDRESS, vendingMachineAbi, signer || provider)

  useEffect(() => {
    loadContractData()
  }, [])

  useEffect(() => {
    if (userAddress && acceptedTokens.length > 0) {
      loadTokenBalances()
    }
  }, [userAddress, acceptedTokens])

  const createMockData = () => {
    const mockTracks: Track[] = [
      {
        trackId: 0,
        product: {
          name: "Demo Chips (Mock Data)",
          imageURI: "/crispy-potato-chips.png",
        },
        price: BigInt("1000000000000000000"), // 1 xDAI
        stock: BigInt("5"),
      },
      {
        trackId: 1,
        product: {
          name: "Demo Soda (Mock Data)",
          imageURI: "/assorted-soda-cans.png",
        },
        price: BigInt("1500000000000000000"), // 1.5 xDAI
        stock: BigInt("3"),
      },
    ]

    const mockTokens: Token[] = [
      {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "xDAI",
        decimals: 18,
        balance: BigInt("10000000000000000000"), // 10 xDAI
      },
    ]

    return { mockTracks, mockTokens }
  }

  const loadContractData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("=== Loading Contract Data ===")
      console.log("Contract Address:", VENDING_MACHINE_ADDRESS)
      console.log("Gnosis RPC URL:", GNOSIS_RPC_URL)
      console.log("=============================")

      // First, check if there's code at the contract address on Gnosis Chain
      const code = await provider.getCode(VENDING_MACHINE_ADDRESS)
      console.log("Contract bytecode length:", code.length)

      if (code === "0x") {
        console.log("No contract found at address, using mock data")
        setContractExists(false)

        // Use mock data when no contract exists
        const { mockTracks, mockTokens } = createMockData()
        setTracks(mockTracks)
        setAcceptedTokens(mockTokens)
        setVoteTokenAddress("0x0000000000000000000000000000000000000000")

        setError(`No contract deployed at ${VENDING_MACHINE_ADDRESS} on Gnosis Chain. Showing demo data.`)
        return
      }

      setContractExists(true)
      console.log("Contract found! Attempting to load data...")

      // Try to load real contract data
      try {
        console.log("Calling getAllTracks()...")
        const tracksData = await vendingMachineContract.getAllTracks()
        console.log("Tracks loaded successfully:", tracksData.length, "tracks")

        const formattedTracks: Track[] = tracksData.map((track: any) => ({
          trackId: Number(track.trackId),
          product: {
            name: track.product.name,
            imageURI: track.product.imageURI,
          },
          price: track.price,
          stock: track.stock,
        }))
        setTracks(formattedTracks)
      } catch (trackError) {
        console.error("Failed to load tracks:", trackError)
        const { mockTracks } = createMockData()
        setTracks(mockTracks)
        throw new Error(`Contract found but getAllTracks() failed. Using mock data. Error: ${trackError}`)
      }

      // Try to load accepted tokens
      try {
        console.log("Calling getAcceptedTokens()...")
        const tokenAddresses = await vendingMachineContract.getAcceptedTokens()
        console.log("Token addresses loaded:", tokenAddresses)

        const tokenPromises = tokenAddresses.map(async (address: string) => {
          try {
            const tokenContract = new ethers.Contract(address, erc20Abi, provider)
            const [symbol, decimals] = await Promise.all([tokenContract.symbol(), tokenContract.decimals()])
            return {
              address,
              symbol,
              decimals: Number(decimals),
              balance: 0n,
            }
          } catch (tokenError) {
            console.error(`Error loading token ${address}:`, tokenError)
            return {
              address,
              symbol: "UNKNOWN",
              decimals: 18,
              balance: 0n,
            }
          }
        })
        const tokens = await Promise.all(tokenPromises)
        setAcceptedTokens(tokens)
      } catch (tokenError) {
        console.error("Failed to load accepted tokens:", tokenError)
        const { mockTokens } = createMockData()
        setAcceptedTokens(mockTokens)
      }

      // Try to load vote token address
      try {
        console.log("Calling voteToken()...")
        const voteToken = await vendingMachineContract.voteToken()
        console.log("Vote token loaded:", voteToken)
        setVoteTokenAddress(voteToken)
      } catch (voteTokenError) {
        console.error("Failed to load vote token:", voteTokenError)
        setVoteTokenAddress("0x0000000000000000000000000000000000000000")
      }

      console.log("Contract data loaded successfully!")
    } catch (err: any) {
      console.error("Error loading contract data:", err)

      // Always provide mock data for demonstration, even on error
      const { mockTracks, mockTokens } = createMockData()
      setTracks(mockTracks)
      setAcceptedTokens(mockTokens)
      setVoteTokenAddress("0x0000000000000000000000000000000000000000")

      setError(err.message || "Failed to load contract data. Showing demo data.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadTokenBalances = async () => {
    if (!userAddress || acceptedTokens.length === 0) return

    try {
      const updatedTokens = await Promise.all(
        acceptedTokens.map(async (token) => {
          try {
            if (token.address === "0x0000000000000000000000000000000000000000") {
              // Mock token, return mock balance
              return { ...token, balance: BigInt("10000000000000000000") }
            }
            const tokenContract = new ethers.Contract(token.address, erc20Abi, provider)
            const balance = await tokenContract.balanceOf(userAddress)
            return { ...token, balance }
          } catch (err) {
            console.error(`Error loading balance for ${token.symbol}:`, err)
            return { ...token, balance: 0n }
          }
        }),
      )
      setAcceptedTokens(updatedTokens)
    } catch (err) {
      console.error("Error loading token balances:", err)
    }
  }

  const checkTokenAllowance = async (tokenAddress: string): Promise<bigint> => {
    if (!signer || !userAddress) return 0n

    try {
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer)
      const allowance = await tokenContract.allowance(userAddress, VENDING_MACHINE_ADDRESS)
      return allowance
    } catch (err) {
      console.error("Error checking allowance:", err)
      return 0n
    }
  }

  const approveToken = async (tokenAddress: string, amount: bigint): Promise<string> => {
    if (!signer) throw new Error("No signer available")

    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer)
    const tx = await tokenContract.approve(VENDING_MACHINE_ADDRESS, amount)
    return tx.hash
  }

  const purchaseFromTrack = async (trackId: number, tokenAddress: string): Promise<string> => {
    if (!signer || !userAddress) throw new Error("Wallet not connected")

    // If using mock data, simulate a purchase
    if (!contractExists || tokenAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("This is demo data. To make real purchases, deploy a vending machine contract to Gnosis Chain.")
    }

    const track = tracks.find((t) => t.trackId === trackId)
    if (!track) throw new Error("Track not found")

    setPurchaseState({ isLoading: true, error: null, txHash: null, step: "checking-allowance" })

    try {
      // Check allowance
      const allowance = await checkTokenAllowance(tokenAddress)

      if (allowance < track.price) {
        setPurchaseState((prev) => ({ ...prev, step: "approving" }))

        // Request approval
        const approveTxHash = await approveToken(tokenAddress, track.price)

        // Wait for approval
        await provider.waitForTransaction(approveTxHash)
      }

      setPurchaseState((prev) => ({ ...prev, step: "purchasing" }))

      // Execute purchase
      const tx = await vendingMachineContract.vendFromTrack(trackId, tokenAddress, userAddress)

      setPurchaseState((prev) => ({ ...prev, txHash: tx.hash, step: "success" }))

      // Wait for transaction and refresh data
      await tx.wait()
      await loadContractData()
      await loadTokenBalances()

      return tx.hash
    } catch (err: any) {
      console.error("Purchase error:", err)
      const errorMessage = err.reason || err.message || "Purchase failed"
      setPurchaseState({ isLoading: false, error: errorMessage, txHash: null, step: "error" })
      throw new Error(errorMessage)
    } finally {
      setTimeout(() => {
        setPurchaseState({ isLoading: false, error: null, txHash: null, step: "idle" })
      }, 5000)
    }
  }

  const refreshData = async () => {
    await loadContractData()
    if (userAddress) {
      await loadTokenBalances()
    }
  }

  return {
    tracks,
    acceptedTokens,
    voteTokenAddress,
    isLoading,
    error,
    contractExists,
    purchaseState,
    purchaseFromTrack,
    refreshData,
  }
}
