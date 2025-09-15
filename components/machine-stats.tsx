"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { formatEther } from "viem"
import { Package, DollarSign, ShoppingCart, Activity, TrendingUp, Users } from "lucide-react"

export function MachineStats() {
  const { stats, tracks, isLoading } = useVendingMachine()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalStock = tracks.reduce((sum, track) => sum + Number(track.stock), 0)
  const averagePrice =
    tracks.length > 0 ? tracks.reduce((sum, track) => sum + Number(formatEther(track.price)), 0) / tracks.length : 0

  const statsData = [
    {
      title: "Active Products",
      value: stats.activeTracks.toString(),
      description: `${totalStock} items in stock`,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Revenue",
      value: `${formatEther(stats.totalRevenue)} XDAI`,
      description: "All-time earnings",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Sales",
      value: stats.totalSales.toString(),
      description: "Items sold",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg. Price",
      value: `${averagePrice.toFixed(2)} XDAI`,
      description: "Per item",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Machine Statistics</h2>
        <Badge variant="outline" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Network Overview
          </CardTitle>
          <CardDescription>Real-time status of the vending machine network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
              <div className="text-sm font-medium">Active Machines</div>
              <div className="text-xs text-muted-foreground">This location</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
              <div className="text-sm font-medium">Uptime</div>
              <div className="text-xs text-muted-foreground">Last 30 days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-sm font-medium">Availability</div>
              <div className="text-xs text-muted-foreground">Always open</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
