"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Coins, RefreshCw, TrendingUp, ExternalLink } from "lucide-react"
import { ethers } from "ethers"
import type { Token } from "@/lib/types"
import { UI_CONFIG } from "@/lib/config"

interface TokenBalanceProps {
  paymentToken: Token | null
  voteTokenAddress: string
  onRefresh: () => void
  isRefreshing: boolean
}

export function TokenBalance({ paymentToken, voteTokenAddress, onRefresh, isRefreshing }: TokenBalanceProps) {
  const formatBalance = (balance: bigint, decimals: number) => {
    const formatted = ethers.formatUnits(balance, decimals)
    const num = Number.parseFloat(formatted)
    return num.toFixed(UI_CONFIG.priceDisplayDecimals)
  }

  if (!paymentToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Token Balance
          </div>
          <Button onClick={onRefresh} disabled={isRefreshing} variant="ghost" size="sm">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Token Balance */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-semibold text-blue-700 dark:text-blue-300">{paymentToken.symbol}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Payment Token</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatBalance(paymentToken.balance, paymentToken.decimals)}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">{paymentToken.symbol}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="text-blue-600 dark:text-blue-400 font-mono">
              {paymentToken.address.slice(0, 6)}...{paymentToken.address.slice(-4)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://gnosisscan.io/token/${paymentToken.address}`, "_blank")}
              className="h-6 px-2 text-blue-600 dark:text-blue-400"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Vote Token Info */}
        {voteTokenAddress && voteTokenAddress !== "0x0000000000000000000000000000000000000000" && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Vote Tokens
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Earned from purchases</div>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
              >
                Rewards
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="text-green-600 dark:text-green-400 font-mono">
                {voteTokenAddress.slice(0, 6)}...{voteTokenAddress.slice(-4)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`https://gnosisscan.io/token/${voteTokenAddress}`, "_blank")}
                className="h-6 px-2 text-green-600 dark:text-green-400"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Balances update automatically after transactions
        </div>
      </CardContent>
    </Card>
  )
}
