import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Wallet, Target, BarChart3 } from "lucide-react"

const revenueStats = [
  {
    title: "Total Revenue",
    value: "$127,450",
    change: "+12.3%",
    period: "This month",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Your Share",
    value: "$3,847",
    change: "+8.7%",
    period: "This month",
    icon: Wallet,
    color: "text-blue-600",
  },
  {
    title: "Active Machines",
    value: "156",
    change: "+5 new",
    period: "This week",
    icon: Target,
    color: "text-purple-600",
  },
  {
    title: "Avg. Daily Revenue",
    value: "$4,115",
    change: "+2.1%",
    period: "7-day avg",
    icon: BarChart3,
    color: "text-orange-600",
  },
]

const revenueStreams = [
  {
    name: "Product Sales",
    percentage: 65,
    amount: "$82,843",
    description: "Direct sales from vending machines",
    color: "bg-blue-500",
  },
  {
    name: "Transaction Fees",
    percentage: 20,
    amount: "$25,490",
    description: "Fees from payment processing",
    color: "bg-green-500",
  },
  {
    name: "Advertising",
    percentage: 10,
    amount: "$12,745",
    description: "Revenue from display advertisements",
    color: "bg-purple-500",
  },
  {
    name: "Premium Services",
    percentage: 5,
    amount: "$6,372",
    description: "Subscription and premium features",
    color: "bg-orange-500",
  },
]

const payoutTiers = [
  {
    name: "Bronze",
    minShares: 1,
    maxShares: 100,
    percentage: "2.5%",
    features: ["Monthly payouts", "Basic analytics", "Email support"],
    holders: 1250,
  },
  {
    name: "Silver",
    minShares: 101,
    maxShares: 500,
    percentage: "3.0%",
    features: ["Bi-weekly payouts", "Advanced analytics", "Priority support"],
    holders: 890,
  },
  {
    name: "Gold",
    minShares: 501,
    maxShares: 1000,
    percentage: "3.5%",
    features: ["Weekly payouts", "Real-time analytics", "Phone support"],
    holders: 456,
  },
  {
    name: "Platinum",
    minShares: 1001,
    maxShares: null,
    percentage: "4.0%",
    features: ["Daily payouts", "Custom reports", "Dedicated manager"],
    holders: 89,
  },
]

const revenueFlowChart = `
graph TD
    A["Machine Sales"] --> B["Gross Revenue"]
    C["Transaction Fees"] --> B
    D["Advertising"] --> B
    E["Premium Services"] --> B
    
    B --> F["Operating Costs"]
    B --> G["Net Revenue"]
    
    G --> H["Revenue Distribution"]
    H --> I["Stakeholder Shares 60%"]
    H --> J["Platform Operations 25%"]
    H --> K["Growth Fund 10%"]
    H --> L["Reserve Fund 5%"]
    
    I --> M["Tier-based Payouts"]
    M --> N["Bronze 2.5%"]
    M --> O["Silver 3.0%"]
    M --> P["Gold 3.5%"]
    M --> Q["Platinum 4.0%"]
    
    style B fill:#e1f5fe
    style G fill:#c8e6c9
    style I fill:#fff3e0
    style M fill:#f3e5f5
`

export default function RevenueSharePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Revenue Sharing</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Participate in the success of the vending machine network through transparent revenue sharing. Earn passive
            income based on your stake in the cooperative.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {revenueStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="flex items-center mt-4">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500 ml-1">{stat.change}</span>
                    <span className="text-sm text-muted-foreground ml-2">{stat.period}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tiers">Payout Tiers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">Payout History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Distribution</CardTitle>
                  <CardDescription>How total network revenue is allocated</CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram chart={revenueFlowChart} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Streams</CardTitle>
                  <CardDescription>Breakdown of income sources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {revenueStreams.map((stream, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stream.name}</span>
                        <span className="text-sm text-muted-foreground">{stream.amount}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={stream.percentage} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-12">{stream.percentage}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{stream.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Current Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">Silver</div>
                    <div className="text-sm text-muted-foreground mb-3">250 shares • 3.0% rate</div>
                    <div className="text-lg font-semibold text-green-600">$3,847</div>
                    <div className="text-sm text-muted-foreground">This month's earnings</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Next Payout</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">$1,923</div>
                    <div className="text-sm text-muted-foreground mb-3">Estimated bi-weekly payout</div>
                    <div className="flex items-center justify-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">March 30, 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Annual Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">$46,164</div>
                    <div className="text-sm text-muted-foreground mb-3">Based on current performance</div>
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">+12% growth</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payoutTiers.map((tier, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                      <Badge variant="outline">{tier.holders} holders</Badge>
                    </div>
                    <CardDescription>
                      {tier.minShares} - {tier.maxShares || "∞"} shares
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">{tier.percentage}</div>
                      <div className="text-sm text-muted-foreground">Revenue share rate</div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <ul className="space-y-1">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant={tier.name === "Silver" ? "default" : "outline"}
                      className="w-full"
                      disabled={tier.name === "Silver"}
                    >
                      {tier.name === "Silver" ? "Current Tier" : `Upgrade to ${tier.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Revenue chart would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Machine Performance</CardTitle>
                  <CardDescription>Top performing machines by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Campus Center - Building A</div>
                        <div className="text-sm text-muted-foreground">Machine #001</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">$2,450</div>
                        <div className="text-sm text-muted-foreground">This month</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Library Main Floor</div>
                        <div className="text-sm text-muted-foreground">Machine #015</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">$2,180</div>
                        <div className="text-sm text-muted-foreground">This month</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Student Union Food Court</div>
                        <div className="text-sm text-muted-foreground">Machine #008</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">$1,920</div>
                        <div className="text-sm text-muted-foreground">This month</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Best Performing Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">$5,847</div>
                    <div className="text-sm text-muted-foreground">March 15, 2024</div>
                    <div className="text-xs text-muted-foreground mt-1">+23% above average</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">$3.47</div>
                    <div className="text-sm text-muted-foreground">Per purchase</div>
                    <div className="text-xs text-muted-foreground mt-1">+$0.12 from last month</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Peak Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">2-4 PM</div>
                    <div className="text-sm text-muted-foreground">Highest sales volume</div>
                    <div className="text-xs text-muted-foreground mt-1">35% of daily revenue</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Your revenue sharing payments over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Bi-weekly Payout</div>
                        <div className="text-sm text-muted-foreground">March 15, 2024 • Silver Tier</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">+$1,923.50</div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Bi-weekly Payout</div>
                        <div className="text-sm text-muted-foreground">March 1, 2024 • Silver Tier</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">+$1,847.25</div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Tier Upgrade Bonus</div>
                        <div className="text-sm text-muted-foreground">February 20, 2024 • Bronze → Silver</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">+$250.00</div>
                      <Badge variant="outline">Bonus</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">$18,450</div>
                    <div className="text-sm text-muted-foreground">All-time earnings</div>
                    <div className="text-xs text-muted-foreground mt-1">Since joining in Jan 2024</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Monthly</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">$3,690</div>
                    <div className="text-sm text-muted-foreground">Monthly average</div>
                    <div className="text-xs text-muted-foreground mt-1">Based on 5 months</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Best Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">$4,230</div>
                    <div className="text-sm text-muted-foreground">February 2024</div>
                    <div className="text-xs text-muted-foreground mt-1">+15% above average</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
