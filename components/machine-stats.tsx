import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Coins, Users, TrendingUp } from "lucide-react"
import type { MachineInfo } from "@/lib/types/vending-machine"

interface MachineStatsProps {
  machineInfo: MachineInfo | null
  loading: boolean
}

export function MachineStats({ machineInfo, loading }: MachineStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!machineInfo) {
    return null
  }

  const stats = [
    {
      title: "Total Tracks",
      value: machineInfo.totalTracks,
      icon: Package,
      description: "Available product slots",
    },
    {
      title: "In Stock",
      value: machineInfo.totalProducts,
      icon: TrendingUp,
      description: "Products available now",
    },
    {
      title: "Payment Options",
      value: machineInfo.acceptedTokensCount,
      icon: Coins,
      description: "Accepted cryptocurrencies",
    },
    {
      title: "Network",
      value: "Gnosis",
      icon: Users,
      description: "Blockchain network",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
