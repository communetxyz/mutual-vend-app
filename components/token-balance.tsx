"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, RefreshCw } from "lucide-react"
import { ethers } from "ethers"
import type { Token } from "@/lib/types"

interface TokenBalanceProps {
  tokens: Token[]
  voteTokenAddress: string | null
  onRefresh: () => void
  isRefreshing: boolean
}

export function TokenBalance({ tokens, voteTokenAddress, onRefresh, isRefreshing }: TokenBalanceProps) {
  const formatBalance = (balance: bigint, decimals: number) => {
    const formatted = ethers.formatUnits(balance, decimals)
    return Number.parseFloat(formatted).toFixed(4)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Token Balances
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {tokens.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No payment tokens configured</p>
        ) : (
          <div className="space-y-3">
            {tokens.map((token) => (
              <div
                key={token.address}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {token.address.slice(0, 10)}...{token.address.slice(-8)}
                  </div>
                </div>
                <Badge variant="outline" className="font-mono">
                  {formatBalance(token.balance, token.decimals)}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {voteTokenAddress && (
          <div className="pt-3 border-t">
            <div className="text-sm font-medium mb-2">Vote Token</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {voteTokenAddress.slice(0, 10)}...{voteTokenAddress.slice(-8)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
