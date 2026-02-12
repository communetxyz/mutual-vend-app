"use client"

import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteNavigation } from "@/components/site-navigation"
import { WalletConnect } from "@/components/wallet-connect"
import { useVoteToken } from "@/hooks/use-vote-token"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { DollarSign, Vote, ShoppingCart, Users, TrendingUp, Coins } from "lucide-react"
import { formatUnits } from "viem"
import Link from "next/link"

export default function FundingPage() {
  const { isConnected } = useAccount()
  const { balance, totalSupply } = useVoteToken()
  const { tracks, acceptedTokens } = useVendingMachine()

  const formatVoteTokens = (amount: bigint) => {
    return parseFloat(formatUnits(amount, 18)).toFixed(2)
  }

  const totalProducts = tracks.length
  const totalStock = tracks.reduce((sum, track) => sum + Number(track.stock), 0)
  const averagePrice = tracks.length > 0 
    ? tracks.reduce((sum, track) => sum + Number(track.price), 0) / tracks.length / 1e6 
    : 0

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                How Mutual Vend is Funded
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Understand how the cooperative model works and how you can earn VoteTokens to participate in governance
              </p>
            </div>
          </div>
        </section>

        {/* Live Stats */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Live Network Stats</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Current state of the Mutual Vend ecosystem</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total VoteTokens</CardTitle>
                  <Vote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatVoteTokens(totalSupply)}</div>
                  <p className="text-xs text-muted-foreground">Minted from purchases</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products Available</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Different products</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStock}</div>
                  <p className="text-xs text-muted-foreground">Items in inventory</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Per item</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Your Participation */}
        {isConnected && (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Your Participation</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Your stake in the cooperative</p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      Your VoteToken Holdings
                    </CardTitle>
                    <CardDescription>
                      VoteTokens represent your stake in the cooperative and voting power
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your VoteTokens</p>
                        <p className="text-3xl font-bold">{formatVoteTokens(balance)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Share</p>
                        <p className="text-3xl font-bold">
                          {totalSupply > 0n ? ((Number(balance) / Number(totalSupply)) * 100).toFixed(3) : "0.000"}%
                        </p>
                      </div>
                    </div>
                    
                    {balance === 0n && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          You don't have any VoteTokens yet. Purchase items from the vending machine to start earning!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">How the Funding Model Works</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                A cooperative approach to vending machine ownership and governance
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <CardTitle>Purchase Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Buy snacks using stablecoins like USDC. Every purchase generates revenue for the cooperative.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Coins className="h-6 w-6" />
                  </div>
                  <CardTitle>Earn VoteTokens</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically receive VoteTokens equal to your purchase amount (1:1 ratio with USD spent).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Vote className="h-6 w-6" />
                  </div>
                  <CardTitle>Participate in Governance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Use your VoteTokens to participate in decisions about pricing, operations, and future development.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle>Build Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Revenue funds expansion, new machines, and community initiatives decided by VoteToken holders.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Start Earning VoteTokens</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Connect your wallet and make your first purchase to become part of the cooperative
              </p>
              
              {!isConnected ? (
                <WalletConnect />
              ) : (
                <div className="flex gap-4 justify-center">
                  <Link href="/vending-machine">
                    <Button size="lg">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Shop Now
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
          </div>
        </section>
      </main>
    </div>
  )
}