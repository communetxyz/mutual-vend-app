import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import { TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Shield, Zap } from "lucide-react"

const cooperativeStats = [
  {
    title: "Total Members",
    value: "2,847",
    change: "+12.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Total Revenue",
    value: "$45,230",
    change: "+8.7%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Machines",
    value: "156",
    change: "+5.2%",
    trend: "up",
    icon: Zap,
  },
  {
    title: "Avg. Monthly Return",
    value: "3.2%",
    change: "-0.3%",
    trend: "down",
    icon: TrendingUp,
  },
]

const ownershipTiers = [
  {
    name: "Bronze Stakeholder",
    minShares: 1,
    maxShares: 100,
    benefits: ["Monthly dividends", "Voting rights", "Community access"],
    currentHolders: 1250,
    color: "bg-amber-100 text-amber-800",
  },
  {
    name: "Silver Partner",
    minShares: 101,
    maxShares: 500,
    benefits: ["Higher dividend rate", "Priority support", "Beta features"],
    currentHolders: 890,
    color: "bg-gray-100 text-gray-800",
  },
  {
    name: "Gold Investor",
    minShares: 501,
    maxShares: 1000,
    benefits: ["Premium dividends", "Governance participation", "Exclusive events"],
    currentHolders: 456,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "Platinum Elite",
    minShares: 1001,
    maxShares: null,
    benefits: ["Maximum returns", "Board voting", "Strategic input"],
    currentHolders: 89,
    color: "bg-purple-100 text-purple-800",
  },
]

const liquidityFlowChart = `
graph TD
    A["Member Investment"] --> B["Cooperative Pool"]
    B --> C["Machine Deployment"]
    C --> D["Revenue Generation"]
    D --> E["Profit Distribution"]
    E --> F["Member Dividends"]
    E --> G["Reinvestment"]
    G --> C
    
    H["Secondary Market"] --> I["Share Trading"]
    I --> J["Price Discovery"]
    J --> K["Liquidity Provision"]
    
    B --> L["Governance Token"]
    L --> M["Voting Rights"]
    M --> N["Strategic Decisions"]
    
    style A fill:#e1f5fe
    style F fill:#c8e6c9
    style H fill:#fff3e0
    style N fill:#f3e5f5
`

const governanceFlowChart = `
graph LR
    A["Proposal Submission"] --> B["Community Review"]
    B --> C["Voting Period"]
    C --> D{"Quorum Met?"}
    D -->|Yes| E["Implementation"]
    D -->|No| F["Proposal Rejected"]
    E --> G["Execution"]
    G --> H["Results Tracking"]
    
    I["Stakeholder Tiers"] --> J["Voting Weight"]
    J --> C
    
    style A fill:#e3f2fd
    style E fill:#e8f5e8
    style F fill:#ffebee
    style I fill:#f3e5f5
`

export default function LiquidOwnershipPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Liquid Ownership Model</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Participate in a decentralized cooperative where ownership is liquid, transparent, and democratically
            governed through blockchain technology.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cooperativeStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex items-center mt-4">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ml-1 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ownership">Ownership Tiers</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    The liquid ownership model allows fractional ownership of vending machines through tokenized shares
                    that can be traded on secondary markets.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Purchase Shares</h4>
                      <p className="text-sm text-muted-foreground">
                        Buy fractional ownership tokens representing shares in the cooperative
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Earn Dividends</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive proportional returns from machine revenue automatically
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Participate in Governance</h4>
                      <p className="text-sm text-muted-foreground">
                        Vote on key decisions affecting the cooperative's direction
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Trade Freely</h4>
                      <p className="text-sm text-muted-foreground">
                        Buy and sell shares on secondary markets for liquidity
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Benefits</CardTitle>
                  <CardDescription>Why choose liquid ownership over traditional investment models</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">Transparent Operations</h4>
                      <p className="text-sm text-muted-foreground">
                        All transactions and decisions recorded on blockchain
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Passive Income</h4>
                      <p className="text-sm text-muted-foreground">Earn regular dividends from machine operations</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Democratic Governance</h4>
                      <p className="text-sm text-muted-foreground">Every stakeholder has a voice in key decisions</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">High Liquidity</h4>
                      <p className="text-sm text-muted-foreground">Trade shares anytime on secondary markets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ownership" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ownershipTiers.map((tier, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                      <Badge className={tier.color}>{tier.currentHolders} holders</Badge>
                    </div>
                    <CardDescription>
                      {tier.minShares} - {tier.maxShares || "∞"} shares required
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium">Benefits</h4>
                      <ul className="space-y-2">
                        {tier.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="governance" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Governance Process</CardTitle>
                  <CardDescription>How decisions are made in the cooperative</CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram chart={governanceFlowChart} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Proposals</CardTitle>
                  <CardDescription>Active governance proposals requiring your vote</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Expand to University Campuses</h4>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Proposal to deploy 50 new machines across 10 university campuses
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Support: 67%</span>
                        <span>2 days left</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <Button size="sm" className="mt-3">
                      Vote Now
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Increase Dividend Rate</h4>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Proposal to increase monthly dividend distribution from 3% to 4%
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Support: 45%</span>
                        <span>5 days left</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <Button size="sm" className="mt-3">
                      Vote Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="liquidity" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Liquidity Flow</CardTitle>
                <CardDescription>How value flows through the liquid ownership ecosystem</CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram chart={liquidityFlowChart} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Primary Market</CardTitle>
                  <CardDescription>Direct investment in new machine deployments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Price</span>
                      <span className="font-medium">$10.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Min. Investment</span>
                      <span className="font-medium">$100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expected ROI</span>
                      <span className="font-medium text-green-600">12-15%</span>
                    </div>
                    <Button className="w-full mt-4">Invest Now</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Secondary Market</CardTitle>
                  <CardDescription>Trade existing shares with other members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Market Price</span>
                      <span className="font-medium">$10.45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">24h Volume</span>
                      <span className="font-medium">$12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Price Change</span>
                      <span className="font-medium text-green-600">+4.5%</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View Market
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Portfolio</CardTitle>
                  <CardDescription>Your current holdings and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Shares</span>
                      <span className="font-medium">250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Current Value</span>
                      <span className="font-medium">$2,612.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Dividend</span>
                      <span className="font-medium text-green-600">$83.60</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      Manage Portfolio
                    </Button>
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
