"use client"

import { useState } from "react"
import { useAccount, useReadContract } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SiteNavigation } from "@/components/site-navigation"
import { WalletConnect } from "@/components/wallet-connect"
import { useVoteToken } from "@/hooks/use-vote-token"
import { Dice1, Trophy, Coins, ExternalLink, AlertCircle, Gift, Star } from "lucide-react"
import { toast } from "sonner"
import { formatUnits } from "viem"
import Link from "next/link"

// Crowdstake.fun integration URLs and info
const CROWDSTAKE_URL = "https://crowdstake.fun"
const BREADKIT_POOL_URL = `${CROWDSTAKE_URL}/pools/breadkit`

// Mock lottery pools data - in production, this would come from crowdstake.fun API
const LOTTERY_POOLS = [
  {
    id: "votetoken-weekly",
    name: "VoteToken Weekly Lottery",
    description: "Weekly lottery pool using VoteTokens. Winners earn USDC prizes!",
    entryToken: "VoteToken",
    entryAmount: "10",
    prizePool: "500 USDC",
    participants: 47,
    timeRemaining: "3 days",
    featured: true,
  },
  {
    id: "community-grand",
    name: "Community Grand Prize",
    description: "Monthly grand prize lottery with massive rewards for the community",
    entryToken: "VoteToken",
    entryAmount: "50",
    prizePool: "2.5 ETH",
    participants: 23,
    timeRemaining: "18 days",
    featured: false,
  },
  {
    id: "daily-small",
    name: "Daily Quick Draw",
    description: "Small daily lottery for quick wins",
    entryToken: "VoteToken", 
    entryAmount: "5",
    prizePool: "50 USDC",
    participants: 89,
    timeRemaining: "14 hours",
    featured: false,
  },
]

export default function LotteryPage() {
  const { isConnected, address } = useAccount()
  const { balance, totalSupply } = useVoteToken()
  
  const [selectedPool, setSelectedPool] = useState<string | null>(null)

  const formatVoteTokens = (amount: bigint) => {
    return parseFloat(formatUnits(amount, 18)).toFixed(2)
  }

  const handleEnterLottery = (poolId: string) => {
    // In production, this would integrate with crowdstake.fun contracts
    toast.success(`Redirecting to ${poolId} lottery pool on crowdstake.fun...`)
    // window.open(`${BREADKIT_POOL_URL}/${poolId}`, "_blank")
  }

  const canEnterPool = (entryAmount: string) => {
    const required = BigInt(Math.floor(Number(entryAmount) * 1e18))
    return balance >= required
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <Dice1 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Connect to Play Lottery</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to participate in VoteToken lotteries.</p>
            <WalletConnect />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />
      
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
            <Dice1 className="h-8 w-8" />
            VoteToken Lottery Pools
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Use your VoteTokens to enter lottery pools and win prizes!
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              🍞 Powered by Crowdstake.fun (BreadKit)
            </Badge>
            <Link href={CROWDSTAKE_URL} target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                Visit Crowdstake.fun
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {/* VoteToken Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Your VoteToken Balance
              </CardTitle>
              <CardDescription>Use VoteTokens to enter lottery pools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available VoteTokens</p>
                  <p className="text-3xl font-bold">{formatVoteTokens(balance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Share of Total</p>
                  <p className="text-3xl font-bold">
                    {totalSupply > 0n ? ((Number(balance) / Number(totalSupply)) * 100).toFixed(2) : "0.00"}%
                  </p>
                </div>
              </div>
              
              {balance === 0n && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You don't have any VoteTokens yet. Purchase items from the vending machine to earn VoteTokens!
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Lottery Pools */}
          <div className="grid gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Available Lottery Pools
            </h2>
            
            {LOTTERY_POOLS.map((pool) => (
              <Card key={pool.id} className={`${pool.featured ? 'border-yellow-400 dark:border-yellow-600' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {pool.featured && <Star className="h-5 w-5 text-yellow-500" />}
                      {pool.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {pool.featured && <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">Featured</Badge>}
                      <Badge variant="outline">{pool.timeRemaining} left</Badge>
                    </div>
                  </div>
                  <CardDescription>{pool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Entry Cost</p>
                      <p className="font-semibold">{pool.entryAmount} VoteTokens</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Prize Pool</p>
                      <p className="font-semibold">{pool.prizePool}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                      <p className="font-semibold">{pool.participants} players</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Odds</p>
                      <p className="font-semibold">1 in {pool.participants}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {canEnterPool(pool.entryAmount) ? (
                        <span className="text-green-600 dark:text-green-400">✓ You can enter this pool</span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">⚠ Need {pool.entryAmount} VoteTokens to enter</span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleEnterLottery(pool.id)}
                      disabled={!canEnterPool(pool.entryAmount)}
                      variant={pool.featured ? "default" : "outline"}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Enter Lottery
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How VoteToken Lotteries Work</CardTitle>
              <CardDescription>Understanding the lottery system and BreadKit integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Earn VoteTokens</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Purchase items from vending machines to earn VoteTokens (1:1 with dollar amount spent)
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Enter Lottery Pools</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Use your VoteTokens to enter lottery pools on crowdstake.fun (BreadKit platform)
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Win Prizes</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Winners are selected randomly and receive prizes in USDC, ETH, or other tokens
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Support Community</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Lottery participation helps fund community initiatives through the BreadKit cooperative
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BreadKit Integration Info */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🍞 About BreadKit & Crowdstake.fun
              </CardTitle>
              <CardDescription>Learn about our lottery platform partners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Our lottery system is powered by <strong>crowdstake.fun</strong>, which uses BreadKit technology from Breadchain Cooperative. 
                This ensures fair, transparent, and decentralized lottery operations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🎲 Provably Fair</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    All lottery draws are verifiable on-chain using secure randomness
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🤝 Community Owned</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Lottery profits support cooperative initiatives and community projects
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link href={CROWDSTAKE_URL} target="_blank">
                  <Button variant="outline" size="sm">
                    Visit Crowdstake.fun
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
                <Link href="https://breadchain.coop" target="_blank">
                  <Button variant="outline" size="sm">
                    Learn about Breadchain
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}