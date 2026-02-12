"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { sepolia } from "wagmi/chains"
import { SiteNavigation } from "@/components/site-navigation"
import { WalletConnect } from "@/components/wallet-connect"
import { NetworkChecker } from "@/components/network-checker"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vote, Users, TrendingUp, Award, Clock, AlertCircle, ArrowUpDown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VOTE_TOKEN_ABI } from "@/lib/contracts/vote-token-abi"
import { VOTE_TOKEN_ADDRESS } from "@/lib/web3/config"
import { toast } from "sonner"
import { formatEther, parseEther } from "viem"

// Mock data for BreadKit integration - in production, these would be real contract addresses
const BREADKIT_DISTRIBUTION_ADDRESS = "0x1234567890123456789012345678901234567890" as `0x${string}`
const BREADKIT_VOTING_ADDRESS = "0x0987654321098765432109876543210987654321" as `0x${string}`

// Mock recipient data
const MOCK_RECIPIENTS = [
  { address: "0x1111111111111111111111111111111111111111", name: "Platform Development", description: "Core platform features and maintenance" },
  { address: "0x2222222222222222222222222222222222222222", name: "Community Grants", description: "Funding for community-led initiatives" },
  { address: "0x3333333333333333333333333333333333333333", name: "Operator Rewards", description: "Incentives for vending machine operators" },
  { address: "0x4444444444444444444444444444444444444444", name: "Research & Development", description: "Innovation and new feature development" },
  { address: "0x5555555555555555555555555555555555555555", name: "Marketing & Growth", description: "User acquisition and brand awareness" },
]

export default function DemocraticDistributionPage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  const [votePoints, setVotePoints] = useState<{ [key: string]: number }>({})
  const [maxPoints] = useState(100) // Standard 100 points per cycle
  
  const isCorrectNetwork = chainId === sepolia.id
  
  // Get user's voting power (VoteToken balance)
  const { data: votingPower } = useReadContract({
    address: VOTE_TOKEN_ADDRESS,
    abi: VOTE_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  })
  
  const { data: hasVotingPower } = useReadContract({
    address: VOTE_TOKEN_ADDRESS,
    abi: VOTE_TOKEN_ABI,
    functionName: "getVotes",
    args: address ? [address] : undefined,
  })
  
  const { data: totalSupply } = useReadContract({
    address: VOTE_TOKEN_ADDRESS,
    abi: VOTE_TOKEN_ABI,
    functionName: "totalSupply",
  })
  
  const { data: delegatee } = useReadContract({
    address: VOTE_TOKEN_ADDRESS,
    abi: VOTE_TOKEN_ABI,
    functionName: "delegates",
    args: address ? [address] : undefined,
  })
  
  // Contract write functions
  const {
    data: hash,
    isPending,
    writeContract,
    error: writeError
  } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  
  // Handle transaction success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Transaction confirmed!")
      setVotePoints({})
    }
  }, [isSuccess])
  
  // Handle errors
  useEffect(() => {
    if (writeError) {
      toast.error(`Transaction failed: ${writeError.message}`)
    }
  }, [writeError])
  
  const totalAllocatedPoints = Object.values(votePoints).reduce((sum, points) => sum + points, 0)
  const remainingPoints = maxPoints - totalAllocatedPoints
  
  const handlePointChange = (recipientAddress: string, points: number) => {
    const numericPoints = Math.max(0, Math.min(points, maxPoints))
    setVotePoints(prev => ({
      ...prev,
      [recipientAddress]: numericPoints
    }))
  }
  
  const handleSubmitVote = () => {
    if (totalAllocatedPoints === 0) {
      toast.error("Please allocate at least some points before voting")
      return
    }
    
    if (!hasVotingPower || hasVotingPower === 0n) {
      toast.error("You need voting power (VoteTokens) to participate in governance")
      return
    }
    
    // Convert vote points to array format expected by BreadKit
    const pointsArray = MOCK_RECIPIENTS.map(recipient => 
      votePoints[recipient.address] || 0
    )
    
    toast.success(`Vote submitted with ${totalAllocatedPoints} points allocated!`)
    // In production: writeContract({ address: BREADKIT_VOTING_ADDRESS, abi: BREADKIT_VOTING_ABI, functionName: "castVote", args: [pointsArray] })
  }
  
  const handleSelfDelegate = () => {
    if (!address) return
    
    writeContract({
      address: VOTE_TOKEN_ADDRESS,
      abi: VOTE_TOKEN_ABI,
      functionName: "delegate",
      args: [address],
    })
  }
  
  const votingPowerPercentage = votingPower && totalSupply ? 
    Number((votingPower * 100n) / totalSupply) : 0
  
  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        </main>
      </div>
    )
  }
  
  if (!isCorrectNetwork) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <NetworkChecker />
        </main>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Vote className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Democratic Revenue Distribution</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Vote on how vending machine revenue is allocated each cycle
              </p>
            </div>
          </div>
          
          {/* Powered by BreadKit Badge */}
          <Badge variant="outline" className="w-fit">
            🍞 Powered by BreadKit (Breadchain Coop)
          </Badge>
          
          {/* Voting Power Alert */}
          {!hasVotingPower || hasVotingPower === 0n ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need VoteTokens to participate in revenue distribution voting. 
                Purchase items from the vending machine to earn VoteTokens automatically.
              </AlertDescription>
            </Alert>
          ) : delegatee === "0x0000000000000000000000000000000000000000" ? (
            <Alert>
              <Vote className="h-4 w-4" />
              <AlertDescription>
                You have VoteTokens but haven't delegated your voting power yet.{" "}
                <Button variant="link" className="h-auto p-0" onClick={handleSelfDelegate}>
                  Delegate to yourself
                </Button>{" "}
                to activate your voting power.
              </AlertDescription>
            </Alert>
          ) : null}
          
          <Tabs defaultValue="vote" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vote">Cast Vote</TabsTrigger>
              <TabsTrigger value="status">Current Cycle</TabsTrigger>
              <TabsTrigger value="history">Past Distributions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vote" className="space-y-6">
              {/* Voting Power Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Your Voting Power
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label className="text-sm text-gray-500">VoteTokens Held</Label>
                      <p className="text-2xl font-bold">
                        {votingPower ? formatEther(votingPower) : "0"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Active Voting Power</Label>
                      <p className="text-2xl font-bold">
                        {hasVotingPower ? formatEther(hasVotingPower) : "0"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">% of Total Supply</Label>
                      <p className="text-2xl font-bold">
                        {votingPowerPercentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Vote Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle>Allocate Your Points</CardTitle>
                  <p className="text-sm text-gray-500">
                    Distribute {maxPoints} points across revenue recipients
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Points Remaining</Label>
                    <Badge variant={remainingPoints < 0 ? "destructive" : "secondary"}>
                      {remainingPoints} / {maxPoints}
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={(totalAllocatedPoints / maxPoints) * 100} 
                    className="h-2"
                  />
                  
                  <div className="space-y-4">
                    {MOCK_RECIPIENTS.map((recipient) => (
                      <Card key={recipient.address} className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">{recipient.name}</h4>
                            <p className="text-sm text-gray-500">{recipient.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Label className="text-sm">Points:</Label>
                            <Input
                              type="number"
                              min="0"
                              max={maxPoints}
                              value={votePoints[recipient.address] || 0}
                              onChange={(e) => handlePointChange(recipient.address, parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                            <div className="flex-1">
                              <Progress 
                                value={(votePoints[recipient.address] || 0) / maxPoints * 100}
                                className="h-2"
                              />
                            </div>
                            <span className="text-sm text-gray-500 w-12">
                              {Math.round((votePoints[recipient.address] || 0) / maxPoints * 100)}%
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleSubmitVote}
                    disabled={isPending || isConfirming || totalAllocatedPoints === 0 || !hasVotingPower || remainingPoints < 0}
                    className="w-full"
                  >
                    {isPending || isConfirming ? "Submitting Vote..." : "Submit Vote"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="status" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Current Distribution Cycle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm text-gray-500">Cycle Number</Label>
                      <p className="text-2xl font-bold">#12</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Time Remaining</Label>
                      <p className="text-2xl font-bold">18 days</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Total Revenue Pool</Label>
                      <p className="text-2xl font-bold">2.5 ETH</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Voters This Cycle</Label>
                      <p className="text-2xl font-bold">47</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-500">Current Vote Distribution</Label>
                    <div className="mt-2 space-y-2">
                      {MOCK_RECIPIENTS.map((recipient, index) => (
                        <div key={recipient.address} className="flex items-center justify-between">
                          <span className="text-sm">{recipient.name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.random() * 100} className="w-20 h-2" />
                            <span className="text-sm text-gray-500 w-10">{Math.floor(Math.random() * 30 + 10)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-6">
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Past Distribution Cycles</h3>
                
                {[11, 10, 9].map((cycleNum) => (
                  <Card key={cycleNum}>
                    <CardContent className="pt-6">
                      <div className="grid gap-2 md:grid-cols-4">
                        <div>
                          <Label className="text-sm text-gray-500">Cycle</Label>
                          <p className="font-medium">#{cycleNum}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Total Distributed</Label>
                          <p className="font-medium">{(2 + Math.random()).toFixed(2)} ETH</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Participants</Label>
                          <p className="font-medium">{Math.floor(Math.random() * 20 + 30)}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Date</Label>
                          <p className="font-medium">{new Date(Date.now() - (12 - cycleNum) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Mutual Vend. All rights reserved.</p>
      </footer>
    </div>
  )
}