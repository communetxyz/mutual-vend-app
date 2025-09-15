import { SiteNavigation } from "@/components/site-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import {
  TrendingUp,
  DollarSign,
  Users,
  PieChart,
  Calculator,
  ArrowRight,
  CheckCircle,
  Clock,
  Coins,
  BarChart3,
  Target,
  Zap,
} from "lucide-react"

export default function RevenueSharePage() {
  const revenueFlowChart = `
    graph TD
        A["Machine Revenue"] --> B["Revenue Distribution"]
        B --> C["Token Holders (60%)"]
        B --> D["Operations (25%)"]
        B --> E["Development (10%)"]
        B --> F["Reserve Fund (5%)"]
        
        C --> G["Daily Payouts"]
        G --> H["Automatic Distribution"]
        H --> I["Wallet Credits"]
        
        D --> J["Maintenance"]
        D --> K["Restocking"]
        D --> L["Location Fees"]
        
        E --> M["Platform Updates"]
        E --> N["New Features"]
        
        F --> O["Emergency Fund"]
        F --> P["Expansion Capital"]
  `

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="h-10 w-10 text-green-600" />
            Revenue Sharing Model
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Transparent, automated revenue distribution to token holders and stakeholders
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">$12,847</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue (30d)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Token Holders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">Daily</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Payout Frequency</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">12.4%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average APY</div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Flow */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue Distribution Flow
            </CardTitle>
            <CardDescription>How machine profits are automatically distributed among stakeholders</CardDescription>
          </CardHeader>
          <CardContent>
            <MermaidDiagram chart={revenueFlowChart} />
          </CardContent>
        </Card>

        {/* Distribution Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Allocation
              </CardTitle>
              <CardDescription>Percentage breakdown of all machine revenue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <div>
                      <div className="font-medium">Token Holders</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Direct profit sharing</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">60%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">$7,708</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    <div>
                      <div className="font-medium">Operations</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Maintenance & restocking</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">25%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">$3,212</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                    <div>
                      <div className="font-medium">Development</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Platform improvements</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-600">10%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">$1,285</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                    <div>
                      <div className="font-medium">Reserve Fund</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Emergency & expansion</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">5%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">$642</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Payout Calculator
              </CardTitle>
              <CardDescription>Estimate your daily earnings based on token holdings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Your Token Holdings</label>
                  <div className="text-2xl font-bold text-blue-600">1,000 MVEND</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Your Ownership %</label>
                  <div className="text-lg font-semibold">0.08%</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Daily Revenue Share</span>
                  <span className="font-medium">$6.18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Weekly Earnings</span>
                  <span className="font-medium">$43.26</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Projection</span>
                  <span className="font-medium text-green-600">$185.40</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Annual APY</span>
                  <span className="font-bold text-green-600">22.2%</span>
                </div>
              </div>

              <Button className="w-full">Calculate Your Returns</Button>
            </CardContent>
          </Card>
        </div>

        {/* Payout Schedule */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Payout Schedule & Process
            </CardTitle>
            <CardDescription>Automated daily distributions with transparent tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold">Daily at 12:00 UTC</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consistent payout timing for global accessibility
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold">Automatic Distribution</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smart contracts handle all calculations and transfers
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold">Instant Settlement</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Funds appear in your wallet immediately</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payouts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Recent Payouts
            </CardTitle>
            <CardDescription>Historical distribution data for transparency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold">Today's Distribution</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">March 15, 2025 - 12:00 UTC</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">$462.84</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">1,247 recipients</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <div className="font-semibold">Yesterday</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">March 14, 2025 - 12:00 UTC</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">$438.92</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">1,243 recipients</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <div className="font-semibold">March 13, 2025</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">12:00 UTC</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">$521.76</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">1,239 recipients</div>
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
                <CheckCircle className="h-5 w-5" />
                Revenue Sharing Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Passive Income</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Earn daily without active participation
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Transparent Distribution</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      All payouts are publicly verifiable on-chain
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Proportional Rewards</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Earnings scale with your token holdings
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">No Lock-up Period</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Trade tokens anytime while earning</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <span className="font-medium">Average Daily Yield</span>
                  <span className="font-bold text-blue-600">0.034%</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <span className="font-medium">30-Day APY</span>
                  <span className="font-bold text-green-600">12.4%</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <span className="font-medium">Total Distributed</span>
                  <span className="font-bold text-purple-600">$127,439</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <span className="font-medium">Payout Reliability</span>
                  <span className="font-bold text-orange-600">99.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Start Earning Revenue Share
            </CardTitle>
            <CardDescription>Begin receiving daily payouts from vending machine profits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold">Purchase Tokens</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Buy MVEND tokens to become a revenue shareholder
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold">Hold in Wallet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep tokens in your wallet to be eligible for payouts
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-semibold">Receive Payouts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get daily USDC distributions automatically</p>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" className="px-8">
                Buy MVEND Tokens
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Start earning from day one</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
