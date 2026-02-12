"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi"
import { sepolia } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { NetworkChecker } from "@/components/network-checker"
import { SiteNavigation } from "@/components/site-navigation"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { ERC20_ABI } from "@/lib/contracts/erc20-abi"
import { VENDING_MACHINE_ADDRESS, MOCK_USDC_ADDRESS } from "@/lib/web3/config"
import { Wallet, DollarSign, TrendingUp, Shield, Download } from "lucide-react"
import { toast } from "sonner"
import { formatEther, parseEther, formatUnits } from "viem"

export default function TreasuryPage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawTo, setWithdrawTo] = useState(address || "")
  const [selectedToken, setSelectedToken] = useState("")
  
  const isCorrectNetwork = chainId === sepolia.id
  
  // Check if user has treasury role
  const { data: treasuryRole } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "TREASURY_ROLE",
  })
  
  const { data: hasTreasuryRole } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "hasRole",
    args: treasuryRole && address ? [treasuryRole, address] : undefined,
  })
  
  // Get accepted tokens
  const { data: acceptedTokens } = useReadContract({
    address: VENDING_MACHINE_ADDRESS,
    abi: VENDING_MACHINE_ABI,
    functionName: "getAcceptedTokens",
  })
  
  // Get token balances for the vending machine
  const tokenContracts = acceptedTokens?.flatMap((tokenAddress) => [
    {
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "name",
    },
    {
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "symbol",
    },
    {
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "decimals",
    },
    {
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [VENDING_MACHINE_ADDRESS],
    },
  ]) || []

  const { data: tokenData, refetch: refetchBalances } = useReadContracts({
    contracts: tokenContracts,
  })
  
  // Process token data into structured format
  const tokenBalances = acceptedTokens?.map((tokenAddress, index) => {
    const baseIndex = index * 4
    const nameResult = tokenData?.[baseIndex]
    const symbolResult = tokenData?.[baseIndex + 1]
    const decimalsResult = tokenData?.[baseIndex + 2]
    const balanceResult = tokenData?.[baseIndex + 3]
    
    if (
      nameResult?.status === "success" &&
      symbolResult?.status === "success" &&
      decimalsResult?.status === "success" &&
      balanceResult?.status === "success"
    ) {
      return {
        address: tokenAddress,
        name: nameResult.result as string,
        symbol: symbolResult.result as string,
        decimals: decimalsResult.result as number,
        balance: balanceResult.result as bigint,
      }
    }
    return null
  }).filter(Boolean) || []
  
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
      refetchBalances()
      setWithdrawAmount("")
    }
  }, [isSuccess, refetchBalances])
  
  // Handle errors
  useEffect(() => {
    if (writeError) {
      toast.error(`Transaction failed: ${writeError.message}`)
    }
  }, [writeError])
  
  // Set withdraw address to current user by default
  useEffect(() => {
    if (address && !withdrawTo) {
      setWithdrawTo(address)
    }
  }, [address, withdrawTo])
  
  const handleWithdrawRevenue = () => {
    if (!withdrawAmount || !selectedToken || !withdrawTo) {
      toast.error("Please fill in all fields")
      return
    }
    
    const selectedTokenData = tokenBalances.find(token => token.address === selectedToken)
    if (!selectedTokenData) {
      toast.error("Invalid token selected")
      return
    }
    
    const amount = parseEther(withdrawAmount)
    
    if (amount > selectedTokenData.balance) {
      toast.error("Withdrawal amount exceeds available balance")
      return
    }
    
    writeContract({
      address: VENDING_MACHINE_ADDRESS,
      abi: VENDING_MACHINE_ABI,
      functionName: "withdrawRevenue",
      args: [[selectedToken], withdrawTo, [amount]],
    })
  }
  
  const totalValueUSD = tokenBalances.reduce((total, token) => {
    // Simple approximation - in reality you'd use an oracle
    const tokenValue = Number(formatUnits(token.balance, token.decimals))
    return total + tokenValue
  }, 0)
  
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
  
  if (!hasTreasuryRole) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You don't have treasury permissions to access this dashboard.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Treasury Management</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage vending machine revenue and treasury funds
              </p>
            </div>
          </div>
          
          <Badge variant="secondary" className="w-fit">
            Connected as Treasury Manager
          </Badge>
          
          <Tabs defaultValue="balances" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="balances">Token Balances</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw Revenue</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="balances" className="space-y-6">
              {/* Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Treasury Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label className="text-sm text-gray-500">Total Value (Est.)</Label>
                      <p className="text-2xl font-bold">
                        ${totalValueUSD.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Number of Tokens</Label>
                      <p className="text-2xl font-bold">
                        {tokenBalances.length}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Revenue Sources</Label>
                      <p className="text-2xl font-bold">
                        Vending Machine Sales
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Token Balances */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Token Balances</h3>
                {tokenBalances.map((token) => (
                  <Card key={token.address}>
                    <CardContent className="pt-6">
                      <div className="grid gap-2 md:grid-cols-4">
                        <div>
                          <Label className="text-sm text-gray-500">Token</Label>
                          <p className="font-medium">{token.name} ({token.symbol})</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Balance</Label>
                          <p className="font-medium">
                            {formatUnits(token.balance, token.decimals)} {token.symbol}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Contract</Label>
                          <p className="font-mono text-sm truncate">{token.address}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Est. Value</Label>
                          <p className="font-medium">
                            ${Number(formatUnits(token.balance, token.decimals)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {tokenBalances.length === 0 && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-gray-500">No token balances found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="withdraw" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Withdraw Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="token">Select Token</Label>
                      <select
                        id="token"
                        value={selectedToken}
                        onChange={(e) => setSelectedToken(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a token...</option>
                        {tokenBalances.map((token) => (
                          <option key={token.address} value={token.address}>
                            {token.symbol} - {formatUnits(token.balance, token.decimals)} available
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount to Withdraw</Label>
                      <Input
                        id="amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.0"
                        type="number"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="withdrawTo">Withdraw To Address</Label>
                      <Input
                        id="withdrawTo"
                        value={withdrawTo}
                        onChange={(e) => setWithdrawTo(e.target.value)}
                        placeholder="0x..."
                      />
                    </div>
                    
                    <Button 
                      onClick={handleWithdrawRevenue} 
                      disabled={isPending || isConfirming || !selectedToken || !withdrawAmount || !withdrawTo}
                      className="w-full"
                    >
                      {isPending || isConfirming ? "Processing..." : "Withdraw Revenue"}
                    </Button>
                  </div>
                  
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Only treasury role holders can withdraw revenue. Ensure the withdrawal address is correct as transactions are irreversible.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-6">
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Recent Withdrawals</h3>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500">
                      Transaction history will be displayed here. This feature connects to blockchain logs to show withdrawal history.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}