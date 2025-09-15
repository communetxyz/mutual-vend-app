import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Users, Target, PieChart, BarChart3 } from "lucide-react"

const fundingRounds = [
  {
    name: "Seed Round",
    status: "completed",
    raised: "$250,000",
    target: "$250,000",
    progress: 100,
    investors: 45,
    date: "Q4 2023",
    description: "Initial funding for prototype development and team building",
  },
  {
    name: "Series A",
    status: "active",
    raised: "$1,200,000",
    target: "$2,000,000",
    progress: 60,
    investors: 128,
    date: "Q1 2024",
    description: "Scaling operations and expanding to 50 locations",
  },
  {
    name: "Series B",
    status: "upcoming",
    raised: "$0",
    target: "$5,000,000",
    progress: 0,
    investors: 0,
    date: "Q3 2024",
    description: "International expansion and advanced AI integration",
  },
]

const investors = [
  {
    name: "Blockchain Ventures",
    type: "Lead Investor",
    amount: "$500,000",
    round: "Series A",
    logo: "/blockchain-logo.png",
  },
  {
    name: "Tech Innovation Fund",
    type: "Strategic Investor",
    amount: "$300,000",
    round: "Series A",
    logo: "/tech-fund-logo.jpg",
  },
  {
    name: "Crypto Capital",
    type: "Financial Investor",
    amount: "$200,000",
    round: "Seed",
    logo: "/crypto-capital-logo.jpg",
  },
  {
    name: "Future Retail Partners",
    type: "Strategic Partner",
    amount: "$150,000",
    round: "Seed",
    logo: "/retail-partners-logo.jpg",
  },
]

const metrics = [
  {
    title: "Total Raised",
    value: "$1,450,000",
    change: "+$400K this quarter",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Active Investors",
    value: "173",
    change: "+28 new investors",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Valuation",
    value: "$8.5M",
    change: "+41% from last round",
    icon: TrendingUp,
    color: "text-purple-600",
  },
  {
    title: "Funding Goal",
    value: "$7.25M",
    change: "Total target by 2024",
    icon: Target,
    color: "text-orange-600",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "active":
      return "bg-blue-100 text-blue-800"
    case "upcoming":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function FundingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Funding & Investment</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our journey to revolutionize automated retail through blockchain technology. Explore investment
            opportunities and track our funding progress.
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{metric.change}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Funding Rounds */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Funding Rounds</h2>

          <div className="space-y-6">
            {fundingRounds.map((round, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{round.name}</CardTitle>
                      <CardDescription className="mt-1">{round.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(round.status)}>
                        {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Target Date</div>
                        <div className="font-medium">{round.date}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{round.progress}%</span>
                      </div>
                      <Progress value={round.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {round.raised} of {round.target} raised
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{round.raised}</div>
                      <div className="text-sm text-muted-foreground">Raised</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{round.investors}</div>
                      <div className="text-sm text-muted-foreground">Investors</div>
                    </div>
                  </div>

                  {round.status === "active" && (
                    <div className="mt-6 flex gap-3">
                      <Button className="flex-1">Invest Now</Button>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Investors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Our Investors</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {investors.map((investor, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{investor.name}</h3>
                      <p className="text-sm text-muted-foreground">{investor.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{investor.amount}</div>
                      <div className="text-sm text-muted-foreground">{investor.round}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Investment Opportunities */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Investment Opportunities</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Equity Investment
                </CardTitle>
                <CardDescription>Traditional equity investment in Mutual Vend Inc.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Minimum Investment</span>
                    <span className="font-medium">$10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected ROI</span>
                    <span className="font-medium text-green-600">15-25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment Horizon</span>
                    <span className="font-medium">3-5 years</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Voting rights in company decisions</li>
                    <li>• Quarterly financial reports</li>
                    <li>• Exit opportunities through acquisition</li>
                    <li>• Priority access to future rounds</li>
                  </ul>
                </div>

                <Button className="w-full">Invest in Equity</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Token Investment
                </CardTitle>
                <CardDescription>Purchase utility tokens for network participation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Minimum Investment</span>
                    <span className="font-medium">$100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Token Price</span>
                    <span className="font-medium">$0.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Share</span>
                    <span className="font-medium text-green-600">2-4%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Monthly revenue distributions</li>
                    <li>• Governance voting rights</li>
                    <li>• Liquid secondary market</li>
                    <li>• Network usage discounts</li>
                  </ul>
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  Buy Tokens
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Use of Funds */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Use of Funds</h2>

          <Card>
            <CardHeader>
              <CardTitle>How We'll Use the Investment</CardTitle>
              <CardDescription>Breakdown of fund allocation for Series A round</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Hardware & Manufacturing</span>
                    <span className="font-medium">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span>Technology Development</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span>Marketing & Sales</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span>Operations & Team</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Hardware & Manufacturing (40%)</h4>
                    <p className="text-sm text-blue-700">
                      Production of 50 new vending machines, IoT sensors, and payment hardware
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Technology Development (25%)</h4>
                    <p className="text-sm text-green-700">
                      Smart contract development, mobile app, and AI-powered inventory management
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">Marketing & Sales (20%)</h4>
                    <p className="text-sm text-purple-700">
                      Brand building, partnership development, and customer acquisition
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-2">Operations & Team (15%)</h4>
                    <p className="text-sm text-orange-700">
                      Hiring key personnel, legal compliance, and operational infrastructure
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
