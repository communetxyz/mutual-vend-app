"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Coins, BarChart3, Settings } from "lucide-react"
import type { Track, TokenInfo } from "@/lib/types/vending-machine"

interface MachineStatsProps {
  tracks: Track[]
  acceptedTokens: TokenInfo[]
  machineInfo: {
    numTracks: number
    maxStockPerTrack: bigint
  }
  voteTokenAddress?: string
}

export function MachineStats({ tracks, acceptedTokens, machineInfo, voteTokenAddress }: MachineStatsProps) {
  const totalStock = tracks.reduce((sum, track) => sum + Number(track.stock), 0)
  const availableProducts = tracks.filter((track) => track.stock > 0).length
  const totalCapacity = machineInfo.numTracks * Number(machineInfo.maxStockPerTrack)
  const utilizationRate = totalCapacity > 0 ? (totalStock / totalCapacity) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{machineInfo.numTracks}</div>
          <p className="text-xs text-muted-foreground">Max {Number(machineInfo.maxStockPerTrack)} items each</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableProducts}</div>
          <p className="text-xs text-muted-foreground">{totalStock} total items in stock</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Options</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{acceptedTokens.length}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {acceptedTokens.slice(0, 3).map((token) => (
              <Badge key={token.address} variant="secondary" className="text-xs">
                {token.symbol}
              </Badge>
            ))}
            {acceptedTokens.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{acceptedTokens.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Capacity Used</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{utilizationRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {totalStock} / {totalCapacity} slots filled
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
