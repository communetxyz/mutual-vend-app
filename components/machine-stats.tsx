"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, Coins, Users, TrendingUp } from "lucide-react"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

interface MachineStatsProps {
  tracks: Track[]
  acceptedTokens: TokenInfo[]
  voteTokenAddress?: string
}

export function MachineStats({ tracks, acceptedTokens, voteTokenAddress }: MachineStatsProps) {
  const totalProducts = tracks.length
  const inStockProducts = tracks.filter((track) => track.stock > 0).length
  const totalStock = tracks.reduce((sum, track) => sum + Number(track.stock), 0)
  const stockPercentage = totalProducts > 0 ? (inStockProducts / totalProducts) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">{inStockProducts} currently in stock</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Level</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStock}</div>
          <Progress value={stockPercentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">{stockPercentage.toFixed(1)}% products available</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{acceptedTokens.length}</div>
          <div className="flex flex-wrap gap-1 mt-2">
            {acceptedTokens.slice(0, 3).map((token) => (
              <Badge key={token.address} variant="secondary" className="text-xs">
                {token.symbol}
              </Badge>
            ))}
            {acceptedTokens.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{acceptedTokens.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rewards Token</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {voteTokenAddress ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">None</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">
            {voteTokenAddress ? "Earn rewards on purchases" : "No rewards program"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
