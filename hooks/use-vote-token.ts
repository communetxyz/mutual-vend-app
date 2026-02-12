"use client"

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { VOTE_TOKEN_ABI } from "@/lib/contracts/vote-token-abi"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"
import { useState } from "react"

export function useVoteToken() {
  const { address } = useAccount()
  const [isPending, setIsPending] = useState(false)

  // Read operations
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.VOTE_TOKEN,
    abi: VOTE_TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0"],
    query: {
      enabled: Boolean(address),
    },
  })

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.VOTE_TOKEN,
    abi: VOTE_TOKEN_ABI,
    functionName: "totalSupply",
  })

  const { data: delegates } = useReadContract({
    address: CONTRACT_ADDRESSES.VOTE_TOKEN,
    abi: VOTE_TOKEN_ABI,
    functionName: "delegates",
    args: [address || "0x0"],
    query: {
      enabled: Boolean(address),
    },
  })

  const { data: votes } = useReadContract({
    address: CONTRACT_ADDRESSES.VOTE_TOKEN,
    abi: VOTE_TOKEN_ABI,
    functionName: "getVotes",
    args: [address || "0x0"],
    query: {
      enabled: Boolean(address),
    },
  })

  // Write operations
  const { writeContract, data: hash, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const delegate = async (to: string) => {
    setIsPending(true)
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.VOTE_TOKEN,
        abi: VOTE_TOKEN_ABI,
        functionName: "delegate",
        args: [to as `0x${string}`],
      })
    } catch (error) {
      console.error("Failed to delegate:", error)
    } finally {
      setIsPending(false)
    }
  }

  const selfDelegate = async () => {
    if (!address) return
    delegate(address)
  }

  return {
    // Data
    balance: balance || 0n,
    totalSupply: totalSupply || 0n,
    delegates: delegates || "0x0",
    votes: votes || 0n,
    
    // States
    isPending: isPending || isConfirming,
    isConfirmed,
    error,
    
    // Actions
    delegate,
    selfDelegate,
    refetchBalance,
    
    // Utils
    isDelegated: Boolean(delegates && delegates !== "0x0000000000000000000000000000000000000000"),
    isSelfDelegated: Boolean(delegates && address && delegates.toLowerCase() === address.toLowerCase()),
  }
}