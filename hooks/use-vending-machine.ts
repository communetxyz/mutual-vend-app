import { useReadContract, useWriteContract } from "wagmi"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import type { Track } from "@/lib/types/vending-machine"

export function useVendingMachine(contractAddress?: `0x${string}`) {
  const {
    data: tracks,
    isError: tracksError,
    isLoading: tracksLoading,
    refetch: refetchTracks,
  } = useReadContract({
    address: contractAddress,
    abi: VENDING_MACHINE_ABI,
    functionName: "getAllTracks",
    query: {
      enabled: !!contractAddress,
    },
  })

  const {
    data: acceptedTokens,
    isError: tokensError,
    isLoading: tokensLoading,
    refetch: refetchTokens,
  } = useReadContract({
    address: contractAddress,
    abi: VENDING_MACHINE_ABI,
    functionName: "getAcceptedTokens",
    query: {
      enabled: !!contractAddress,
    },
  })

  const { writeContract: vendFromTrack, isPending: isVending } = useWriteContract()

  const purchaseItem = async (trackId: number, tokenAddress: `0x${string}`, recipient: `0x${string}`) => {
    if (!contractAddress) throw new Error("Contract address not provided")

    return vendFromTrack({
      address: contractAddress,
      abi: VENDING_MACHINE_ABI,
      functionName: "vendFromTrack",
      args: [trackId, tokenAddress, recipient],
    })
  }

  const refreshData = () => {
    refetchTracks()
    refetchTokens()
  }

  return {
    tracks: (tracks as Track[]) || [],
    acceptedTokens: (acceptedTokens as `0x${string}`[]) || [],
    isLoading: tracksLoading || tokensLoading,
    isError: tracksError || tokensError,
    purchaseItem,
    isVending,
    refreshData,
  }
}
