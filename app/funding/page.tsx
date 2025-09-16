import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, DollarSign, Users, Target, TrendingUp, Shield, Globe } from "lucide-react"

export default function FundingPage() {
  const fundingRounds = [
    {
      id: 1,
      title: "Prototype Development",
      description: "Build and test the first generation of smart vending machines",
      target: 50000,
      raised: 35000,
      backers: 127,
      status: "active",
      rewards: ["Early access to machines", "10% revenue share", "Governance tokens"],
    },
    {
      id: 2,
      title: "Market Expansion",
      description: "Deploy machines in 10 major cities across North America",
      target: 200000,
      raised: 0,
      backers: 0,
      status: "upcoming",
      rewards: ["Premium locations", "15% revenue share", "Exclusive partnerships"],
    },
    {
      id: 3,
      title: "Global Rollout",
      description: "International expansion and franchise opportunities",
      target: 500000,
      raised: 0,
      backers: 0,
      status: "planned",
      rewards: ["Global network access", "20% revenue share", "Franchise rights"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">Investment Opportunity</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Fund the Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Autonomous Commerce
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Join our mission to revolutionize vending through blockchain technology. Earn passive income while
              building the future of retail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
                <Link href="#funding-rounds">
                  View Investment Options <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Invest in Mutual Vend?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our innovative approach combines proven vending business models with cutting-edge blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Passive Income</CardTitle>
                <CardDescription>
                  Earn consistent returns from vending machine revenue with automated profit distribution
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Scalable Returns</CardTitle>
                <CardDescription>
                  As we expand our network, your investment value and returns grow proportionally
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Transparent Operations</CardTitle>
                <CardDescription>
                  All transactions and revenue are recorded on-chain for complete transparency
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Community Governance</CardTitle>
                <CardDescription>
                  Vote on key decisions including machine locations and product selection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Global Opportunity</CardTitle>
                <CardDescription>Access investment opportunities in vending machines worldwide</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Proven Market</CardTitle>
                <CardDescription>
                  Vending is a $23B industry with consistent demand and growth potential
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Funding Rounds */}
      <section id="funding-rounds" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Investment Rounds</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the investment level that matches your goals and risk tolerance
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {fundingRounds.map((round) => (
              <Card key={round.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">{round.title}</CardTitle>
                      <CardDescription className="text-lg">{round.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        round.status === "active" ? "default" : round.status === "upcoming" ? "secondary" : "outline"
                      }
                    >
                      {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">${round.raised.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Raised</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">${round.target.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Target</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{round.backers}</div>
                      <div className="text-sm text-gray-500">Backers</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round((round.raised / round.target) * 100)}%</span>
                    </div>
                    <Progress value={(round.raised / round.target) * 100} className="h-3" />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Investor Rewards:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {round.rewards.map((reward, index) => (
                        <li key={index}>{reward}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1" disabled={round.status !== "active"}>
                      {round.status === "active"
                        ? "Invest Now"
                        : round.status === "upcoming"
                          ? "Coming Soon"
                          : "View Details"}
                    </Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-green-100">
            Join hundreds of investors already earning passive income through our vending network
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
              <Link href="/vending-machine">
                Try Demo First <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
