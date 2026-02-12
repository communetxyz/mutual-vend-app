"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SiteNavigation } from "@/components/site-navigation"
import { WalletConnect } from "@/components/wallet-connect"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { useRoles } from "@/hooks/use-roles"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { ERC20_ABI } from "@/lib/contracts/erc20-abi"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"
import { Wallet, DollarSign, Download, Shield, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { formatUnits } from "viem"

export default function TreasuryPage() {
  const { isConnected, address } = useAccount()
  const { hasTreasuryRole, isLoading: rolesLoading } = useRoles()
  const { acceptedTokens, loading } = useVendingMachine()
  
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [withdrawAmounts, setWithdrawAmounts] = useState<{[key: string]: string}>({})
  
  const { writeContract, data: hash, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Get revenue balances for all accepted tokens
  const balanceContracts = acceptedTokens.map(token => ({
    address: token.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [CONTRACT_ADDRESSES.VENDING_MACHINE],
  }))

  const { data: balanceData, refetch: refetchBalances } = useReadContracts({
    contracts: balanceContracts,
  })

  const handleWithdrawSingle = async (tokenAddress: string, symbol: string, decimals: number) => {
    const amount = withdrawAmounts[tokenAddress]
    
    if (!withdrawAddress.trim()) {
      toast.error("Withdrawal address is required")
      return
    }
    
    if (!amount || Number(amount) <= 0) {
      toast.error("Withdrawal amount must be greater than 0")
      return
    }

    try {
      // Convert amount to token units
      const amountInTokens = BigInt(Math.floor(Number(amount) * Math.pow(10, decimals)))
      
      writeContract({
        address: CONTRACT_ADDRESSES.VENDING_MACHINE,
        abi: VENDING_MACHINE_ABI,
        functionName: "withdrawRevenue",
        args: [
          [tokenAddress as `0x${string}`],
          withdrawAddress as `0x${string}`,
          [amountInTokens],
        ],
      })
      
      toast.success(`Withdrawing ${amount} ${symbol}...`)
      setWithdrawAmounts({...withdrawAmounts, [tokenAddress]: ""})
    } catch (err) {
      console.error("Failed to withdraw:", err)
      toast.error(`Failed to withdraw ${symbol}`)
    }
  }

  const handleWithdrawAll = async () => {
    if (!withdrawAddress.trim()) {
      toast.error("Withdrawal address is required")
      return
    }

    if (!balanceData || balanceData.length === 0) {
      toast.error("No token balances available")
      return
    }

    try {
      const tokens: `0x${string}`[] = []
      const amounts: bigint[] = []
      
      balanceData.forEach((result, index) => {
        if (result.status === "success" && result.result as bigint > 0n) {
          tokens.push(acceptedTokens[index].address)
          amounts.push(result.result as bigint)
        }
      })
      
      if (tokens.length === 0) {
        toast.error("No funds available to withdraw")
        return
      }
      
      writeContract({
        address: CONTRACT_ADDRESSES.VENDING_MACHINE,
        abi: VENDING_MACHINE_ABI,
        functionName: "withdrawRevenue",
        args: [tokens, withdrawAddress as `0x${string}`, amounts],
      })
      
      toast.success("Withdrawing all available funds...")
    } catch (err) {
      console.error("Failed to withdraw all:", err)
      toast.error("Failed to withdraw funds")
    }
  }

  // Refresh balances after successful transactions
  if (isConfirmed) {
    setTimeout(() => {
      refetchBalances()
    }, 2000)
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Treasury Access Required</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to access the treasury dashboard.</p>
            <WalletConnect />
          </div>
        </main>
      </div>
    )
  }

  if (rolesLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Checking treasury permissions...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!hasTreasuryRole) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Access Denied</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">You need treasury role to access this page.</p>
            <p className="text-xs text-gray-400">Connected: {address}</p>
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
            <Wallet className="h-8 w-8" />
            Treasury Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage revenue withdrawals and monitor vending machine earnings
          </p>
        </div>

        {error && (
          <Alert className="mb-8 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Revenue Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue Balances
              </CardTitle>
              <CardDescription>Current token balances available for withdrawal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-6 w-6 mx-auto text-gray-400 animate-spin mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Loading revenue data...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {acceptedTokens.map((token, index) => {
                      const balanceResult = balanceData?.[index]
                      const balance = balanceResult?.status === "success" ? balanceResult.result as bigint : 0n
                      const formattedBalance = formatUnits(balance, token.decimals)
                      
                      return (
                        <div key={token.address} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-medium">{token.name} ({token.symbol})</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {token.address.slice(0, 6)}...{token.address.slice(-4)}
                            </p>
                          </div>
                          <Badge variant={balance > 0n ? "default" : "secondary"} className="text-lg px-3 py-1">
                            {parseFloat(formattedBalance).toFixed(2)} {token.symbol}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Withdraw Revenue
              </CardTitle>
              <CardDescription>Withdraw accumulated revenue to a specified address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Withdrawal Address */}
                <div>
                  <Label htmlFor="withdrawAddress">Withdrawal Address</Label>
                  <Input
                    id="withdrawAddress"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="0x... Address to receive withdrawn funds"
                  />
                </div>

                {/* Individual Token Withdrawals */}
                <div className="space-y-4">
                  <h4 className="font-medium">Withdraw Individual Tokens</h4>
                  {acceptedTokens.map((token, index) => {
                    const balanceResult = balanceData?.[index]
                    const balance = balanceResult?.status === "success" ? balanceResult.result as bigint : 0n
                    const formattedBalance = formatUnits(balance, token.decimals)
                    
                    return (
                      <div key={token.address} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{token.symbol}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Available: {parseFloat(formattedBalance).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max={formattedBalance}
                            value={withdrawAmounts[token.address] || ""}
                            onChange={(e) => setWithdrawAmounts({
                              ...withdrawAmounts,
                              [token.address]: e.target.value
                            })}
                            placeholder="0.00"
                            className="w-32"
                            disabled={balance === 0n}
                          />
                          <Button
                            onClick={() => handleWithdrawSingle(token.address, token.symbol, token.decimals)}
                            disabled={
                              isConfirming || 
                              balance === 0n || 
                              !withdrawAmounts[token.address] || 
                              !withdrawAddress.trim()
                            }
                            size="sm"
                          >
                            Withdraw
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Withdraw All */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleWithdrawAll}
                    disabled={
                      isConfirming || 
                      !withdrawAddress.trim() ||
                      !balanceData?.some((result) => result.status === "success" && result.result as bigint > 0n)
                    }
                    className="w-full"
                  >
                    {isConfirming ? "Processing..." : "Withdraw All Available Funds"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}