"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SiteNavigation } from "@/components/site-navigation"
import { WalletConnect } from "@/components/wallet-connect"
import { useVoteToken } from "@/hooks/use-vote-token"
import { Vote, Users, ArrowRight, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { formatUnits, isAddress } from "viem"

export default function GovernancePage() {
  const { isConnected, address } = useAccount()
  const {
    balance,
    totalSupply,
    delegates,
    votes,
    isPending,
    isConfirmed,
    error,
    delegate,
    selfDelegate,
    isDelegated,
    isSelfDelegated
  } = useVoteToken()
  
  const [delegateAddress, setDelegateAddress] = useState("")
  const [isValidAddress, setIsValidAddress] = useState(false)

  const handleAddressChange = (value: string) => {
    setDelegateAddress(value)
    setIsValidAddress(isAddress(value))
  }

  const handleDelegate = async () => {
    if (!isValidAddress) {
      toast.error("Please enter a valid Ethereum address")
      return
    }

    try {
      await delegate(delegateAddress)
      toast.success("Delegation transaction submitted!")
      setDelegateAddress("")
    } catch (err) {
      toast.error("Failed to delegate votes")
    }
  }

  const handleSelfDelegate = async () => {
    try {
      await selfDelegate()
      toast.success("Self-delegation transaction submitted!")
    } catch (err) {
      toast.error("Failed to self-delegate votes")
    }
  }

  const formatVoteTokens = (amount: bigint) => {
    return parseFloat(formatUnits(amount, 18)).toFixed(2)
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <Vote className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Connect to Participate in Governance</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to view your voting power and participate in governance.</p>
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
            <Vote className="h-8 w-8" />
            Governance & Voting
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Use your VoteTokens to participate in Mutual Vend governance decisions
          </p>
        </div>

        {error && (
          <Alert className="mb-8 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Voting Power Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Voting Power
              </CardTitle>
              <CardDescription>VoteToken balance and delegation status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">VoteToken Balance</p>
                  <p className="text-2xl font-bold">{formatVoteTokens(balance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Voting Power</p>
                  <p className="text-2xl font-bold">{formatVoteTokens(votes)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Delegation Status</p>
                {isDelegated ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">
                      {isSelfDelegated ? "Self-delegated" : `Delegated to ${delegates.slice(0, 6)}...${delegates.slice(-4)}`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm">Not delegated - voting power inactive</span>
                  </div>
                )}
              </div>

              {balance > 0n && !isDelegated && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need to delegate your tokens to activate voting power. You can delegate to yourself or another address.
                  </AlertDescription>
                </Alert>
              )}

              {balance === 0n && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You don't have any VoteTokens yet. Purchase items from the vending machine to earn VoteTokens!
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Delegation Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Vote Delegation</CardTitle>
              <CardDescription>Delegate your voting power to yourself or another address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Self Delegation */}
              <div>
                <h4 className="font-medium mb-2">Self Delegation</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Delegate to yourself to use your own voting power
                </p>
                <Button
                  onClick={handleSelfDelegate}
                  disabled={isPending || balance === 0n || isSelfDelegated}
                  className="w-full"
                  variant={isSelfDelegated ? "secondary" : "default"}
                >
                  {isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : isSelfDelegated ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : null}
                  {isSelfDelegated ? "Self-Delegated" : "Delegate to Myself"}
                </Button>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-2">Delegate to Another Address</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Delegate your voting power to another address
                </p>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="delegateAddress">Ethereum Address</Label>
                    <Input
                      id="delegateAddress"
                      value={delegateAddress}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="0x..."
                      className={delegateAddress && !isValidAddress ? "border-red-500" : ""}
                    />
                    {delegateAddress && !isValidAddress && (
                      <p className="text-sm text-red-500 mt-1">Invalid Ethereum address</p>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleDelegate}
                    disabled={isPending || !isValidAddress || balance === 0n}
                    className="w-full"
                  >
                    {isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Delegate Votes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protocol Stats */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Protocol Statistics</CardTitle>
              <CardDescription>Overall VoteToken distribution and governance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total VoteTokens</p>
                  <p className="text-3xl font-bold">{formatVoteTokens(totalSupply)}</p>
                  <p className="text-xs text-gray-400 mt-1">Minted through purchases</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Share</p>
                  <p className="text-3xl font-bold">
                    {totalSupply > 0n ? ((Number(balance) / Number(totalSupply)) * 100).toFixed(2) : "0.00"}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Of total supply</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Voting Status</p>
                  <Badge variant={isDelegated ? "default" : "secondary"} className="text-sm">
                    {isDelegated ? "Active" : "Inactive"}
                  </Badge>
                  <p className="text-xs text-gray-400 mt-1">
                    {isDelegated ? "Ready to vote" : "Need to delegate"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Earn More VoteTokens */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>How to Earn VoteTokens</CardTitle>
              <CardDescription>Increase your voting power by participating in the ecosystem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Purchase from Vending Machines</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Every dollar spent earns you 1 VoteToken (1:1 ratio with payment amount)
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Participate in Governance</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Use your VoteTokens to participate in protocol decisions and improvements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}