import { SiteNavigation } from "@/components/site-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import {
  Droplets,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  PieChart,
  Calculator,
} from "lucide-react"

export default function LiquidOwnershipPage() {
  const ownershipFlowChart = `
    graph TD
        A["Initial Investment"] --> B["Ownership Tokens Minted"]
        B --> C["Revenue Generated"]
        C --> D["Profits Distributed"]
        D --> E["Token Holders Receive Rewards"]
        E --> F["Reinvestment or Withdrawal"]
        F --> C
        
        G["Secondary Market"] --> H["Token Trading"]
        H --> I["Price Discovery"]
        I --> J["Liquidity for Investors"]
        
        B --> G
        E --> K["Governance Voting"]
        K --> L["Operational Decisions"]
        L --> C
  `

  const revenueDistributionChart = `
    pie title Revenue Distribution
        "Token Holders" : 60
        "Operations & Maintenance" : 25
        "Platform Development" : 10
        "Reserve Fund" : 5
  `

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 flex items-center justify-center gap-3">
            <Droplets className="h-10 w-10 text-blue-600" />
            Liquid Ownership Model
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Democratizing vending machine ownership through tokenization and shared revenue streams
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">$50</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Min Investment</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">8-15%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Expected APY</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">100+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Owners per Machine</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Droplets className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyan-600">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Liquidity</div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              How Liquid Ownership Works
            </CardTitle>
            <CardDescription>Transform vending machine ownership into tradeable, liquid assets</CardDescription>
          </CardHeader>
          <CardContent>
            <MermaidDiagram chart={ownershipFlowChart} />
          </CardContent>
        </Card>

        {/* Investment Tiers */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Starter</Badge>
              </CardTitle>
              <CardDescription>Perfect for first-time investors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$50 - $500</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Investment Range</div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Fractional ownership</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Daily revenue sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Instant liquidity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Basic governance rights</span>
                </div>
              </div>
              <Button className="w-full bg-transparent" variant="outline">
                Start Investing
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge>Growth</Badge>
              </CardTitle>
              <CardDescription>For serious investors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">$500 - $2,500</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Investment Range</div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">All Starter benefits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Enhanced governance rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Priority in new machines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Detailed analytics access</span>
                </div>
              </div>
              <Button className="w-full">Invest Now</Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="destructive">Premium</Badge>
              </CardTitle>
              <CardDescription>Maximum ownership benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">$2,500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Investment Range</div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">All Growth benefits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Proposal submission rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Direct operator contact</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Exclusive investment opportunities</span>
                </div>
              </div>
              <Button className="w-full" variant="destructive">
                Premium Access
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue Distribution Model
            </CardTitle>
            <CardDescription>How machine profits are allocated among stakeholders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <MermaidDiagram chart={revenueDistributionChart} />
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="font-medium">Token Holders (60%)</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Direct profit sharing</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                      <span className="font-medium">Operations (25%)</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Maintenance & restocking</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="font-medium">Development (10%)</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Platform improvements</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      <span className="font-medium">Reserve Fund (5%)</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Emergency & expansion</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits & Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Investment Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Passive Income</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Earn daily revenue from machine operations without active management
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Instant Liquidity</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Trade ownership tokens 24/7 on decentralized exchanges
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Fractional Ownership</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Own a piece of expensive assets with minimal capital
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Transparent Operations</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Real-time visibility into machine performance and financials
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Market Risk</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Token values may fluctuate based on machine performance and market conditions
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Operational Risk</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Machine downtime or location changes can affect revenue
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Insurance Coverage</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Comprehensive insurance protects against theft and damage
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Diversification</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Spread risk across multiple machines and locations
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROI Calculator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Investment Calculator
            </CardTitle>
            <CardDescription>Estimate your potential returns based on different investment amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Investment Amount</label>
                  <div className="text-2xl font-bold text-blue-600">$1,000</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Expected APY</label>
                  <div className="text-lg font-semibold">12%</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Monthly Revenue</label>
                  <div className="text-2xl font-bold text-green-600">$10.00</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Annual Revenue</label>
                  <div className="text-lg font-semibold text-green-600">$120.00</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">5-Year Value</label>
                  <div className="text-2xl font-bold text-purple-600">$1,762</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Total Return</label>
                  <div className="text-lg font-semibold text-purple-600">76.2%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Getting Started
            </CardTitle>
            <CardDescription>Begin your liquid ownership journey in three simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold">Connect Wallet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect your crypto wallet to access the investment platform
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold">Choose Investment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select machines and investment amounts that match your goals
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-semibold">Earn Returns</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start receiving daily revenue shares and track your portfolio
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button size="lg" className="px-8">
                Start Investing Today
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
