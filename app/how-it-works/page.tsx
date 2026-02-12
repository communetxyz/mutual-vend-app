"use client"

import { useAccount, useReadContract } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteNavigation } from "@/components/site-navigation"
import { WalletConnect } from "@/components/wallet-connect"
import { useVoteToken } from "@/hooks/use-vote-token"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { 
  Coins, 
  ShoppingCart, 
  Vote, 
  Users, 
  TrendingUp, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  PackageCheck,
  Shield
} from "lucide-react"
import { formatUnits } from "viem"
import Link from "next/link"

export default function HowItWorksPage() {
  const { isConnected } = useAccount()
  const { balance, totalSupply, isDelegated } = useVoteToken()
  const { tracks, acceptedTokens, loading } = useVendingMachine()

  const formatVoteTokens = (amount: bigint) => {
    return parseFloat(formatUnits(amount, 18)).toFixed(2)
  }

  const totalProducts = tracks.length
  const totalStock = tracks.reduce((sum, track) => sum + Number(track.stock), 0)
  const totalValue = tracks.reduce((sum, track) => sum + (Number(track.price) * Number(track.stock)), 0) / 1e6

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                How Mutual Vend Works
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                A simple 4-step process to earn governance tokens and participate in the cooperative economy
              </p>
            </div>
          </div>
        </section>

        {/* Live Network Stats */}
        <section className="w-full py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Live Network Activity</h2>
              <p className="text-gray-500 dark:text-gray-400">Real-time data from the Sepolia testnet</p>
            </div>
            
            {loading ? (
              <div className="text-center">
                <p className="text-gray-500">Loading network stats...</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Vote className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{formatVoteTokens(totalSupply)}</p>
                        <p className="text-sm text-gray-500">Total VoteTokens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <PackageCheck className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{totalStock}</p>
                        <p className="text-sm text-gray-500">Items Available</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">${totalValue.toFixed(0)}</p>
                        <p className="text-sm text-gray-500">Inventory Value</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold">{acceptedTokens.length}</p>
                        <p className="text-sm text-gray-500">Payment Tokens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* How It Works Steps */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Simple 4-Step Process</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                From purchase to governance participation
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="relative">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                    1
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Purchase
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Buy snacks using stablecoins like USDC from any Mutual Vend machine
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    Available: {totalProducts} products
                  </Badge>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                    2
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    Earn VoteTokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically receive VoteTokens equal to your purchase amount (1:1 USD ratio)
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    1:1 ratio
                  </Badge>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                    3
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    Delegate Voting Power
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Delegate your VoteTokens to yourself or another address to activate voting power
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    ERC20Votes standard
                  </Badge>
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                    4
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Participate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Use your voting power to participate in governance decisions and cooperative management
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    Decentralized governance
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Your Progress */}
        {isConnected && (
          <section className="w-full py-12 bg-white dark:bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">Your Progress</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cooperative Participation</CardTitle>
                    <CardDescription>Track your journey in the Mutual Vend ecosystem</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <CheckCircle className={`h-6 w-6 ${balance > 0n ? 'text-green-500' : 'text-gray-300'}`} />
                      <div className="flex-1">
                        <h4 className="font-medium">Earn VoteTokens</h4>
                        <p className="text-sm text-gray-500">You have {formatVoteTokens(balance)} VoteTokens</p>
                      </div>
                      {balance > 0n && <Badge variant="secondary">✓ Complete</Badge>}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <CheckCircle className={`h-6 w-6 ${isDelegated ? 'text-green-500' : 'text-gray-300'}`} />
                      <div className="flex-1">
                        <h4 className="font-medium">Activate Voting Power</h4>
                        <p className="text-sm text-gray-500">Delegate your tokens to participate in governance</p>
                      </div>
                      {isDelegated ? (
                        <Badge variant="secondary">✓ Complete</Badge>
                      ) : balance > 0n ? (
                        <Link href="/liquid-ownership">
                          <Button size="sm" variant="outline">Delegate Now</Button>
                        </Link>
                      ) : (
                        <Badge variant="outline">Need VoteTokens</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <Shield className="h-6 w-6 text-blue-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">Join Governance</h4>
                        <p className="text-sm text-gray-500">Participate in cooperative decision making</p>
                      </div>
                      {isDelegated ? (
                        <Link href="/liquid-ownership">
                          <Button size="sm" variant="outline">View Governance</Button>
                        </Link>
                      ) : (
                        <Badge variant="outline">Complete previous steps</Badge>
                      )}
                    </div>

                    {balance === 0n && (
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Start your journey by purchasing items from the vending machine!
                        </p>
                        <Link href="/vending-machine">
                          <Button className="mt-2" size="sm">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Shop Now
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Key Benefits */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Why It Matters</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Benefits of the cooperative model
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <CardTitle>Democratic Ownership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Every customer becomes a stakeholder with voting rights proportional to their participation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                  <CardTitle>Transparent Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    All revenue flows are transparent and managed through smart contracts on the blockchain
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-purple-500 mb-2" />
                  <CardTitle>Fair Governance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Decisions about pricing, operations, and expansion are made collectively by the community
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Get Started CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Join the cooperative and start earning governance tokens today
            </p>
            
            {!isConnected ? (
              <WalletConnect />
            ) : (
              <div className="flex gap-4 justify-center">
                <Link href="/vending-machine">
                  <Button size="lg">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
                <Link href="/liquid-ownership">
                  <Button variant="outline" size="lg">
                    <Vote className="h-5 w-5 mr-2" />
                    View Governance
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}