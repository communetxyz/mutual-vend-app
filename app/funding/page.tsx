import { SiteNavigation } from "@/components/site-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Wallet, PiggyBank, ArrowRight, CheckCircle, Clock, Star } from "lucide-react"

export default function FundingPage() {
  const fundingGoal = 50000
  const currentFunding = 32500
  const fundingProgress = (currentFunding / fundingGoal) * 100

  const milestones = [
    {
      amount: 10000,
      title: "Prototype Development",
      status: "completed",
      description: "Build and test initial vending machine prototype",
    },
    {
      amount: 25000,
      title: "Smart Contract Audit",
      status: "completed",
      description: "Professional security audit of all smart contracts",
    },
    {
      amount: 40000,
      title: "Manufacturing Setup",
      status: "in-progress",
      description: "Set up production line for vending machines",
    },
    {
      amount: 50000,
      title: "Market Launch",
      status: "pending",
      description: "Deploy first 10 machines in target locations",
    },
  ]

  const backers = [
    { name: "CryptoVentures", amount: 5000, tier: "Gold" },
    { name: "BlockchainFund", amount: 3000, tier: "Silver" },
    { name: "DeFi Collective", amount: 2500, tier: "Silver" },
    { name: "Anonymous", amount: 1000, tier: "Bronze" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Fund the Future of Vending</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Help us revolutionize vending machines with blockchain technology. Support our mission to create
            decentralized, community-owned vending solutions.
          </p>
        </div>

        {/* Funding Progress */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                ${currentFunding.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400">raised of ${fundingGoal.toLocaleString()} goal</div>
            </div>

            <Progress value={fundingProgress} className="h-4 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(fundingProgress)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Funded</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{backers.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Backers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">30</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Days Left</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Funding Tiers */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Funding Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-amber-200 dark:border-amber-800">
              <CardHeader className="text-center">
                <Star className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                <CardTitle className="text-xl">Bronze Supporter</CardTitle>
                <CardDescription>$100 - $999</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Early access to platform
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Supporter badge on profile
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Monthly updates
                  </li>
                </ul>
                <Button className="w-full">
                  <Wallet className="h-4 w-4 mr-2" />
                  Support Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 dark:border-gray-600 transform scale-105">
              <CardHeader className="text-center">
                <Star className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                <CardTitle className="text-xl">Silver Supporter</CardTitle>
                <CardDescription>$1,000 - $4,999</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    All Bronze benefits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    5% revenue share from machines
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Voting rights on locations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Exclusive Discord access
                  </li>
                </ul>
                <Button className="w-full">
                  <Wallet className="h-4 w-4 mr-2" />
                  Support Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-300 dark:border-yellow-600">
              <CardHeader className="text-center">
                <Star className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                <CardTitle className="text-xl">Gold Supporter</CardTitle>
                <CardDescription>$5,000+</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    All Silver benefits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    10% revenue share from machines
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Machine naming rights
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Direct line to founders
                  </li>
                </ul>
                <Button className="w-full">
                  <Wallet className="h-4 w-4 mr-2" />
                  Support Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Milestones */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Funding Milestones</h2>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <Card
                key={index}
                className={`p-6 ${milestone.status === "completed" ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" : milestone.status === "in-progress" ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" : "bg-gray-50 dark:bg-gray-900"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${milestone.status === "completed" ? "bg-green-500" : milestone.status === "in-progress" ? "bg-blue-500" : "bg-gray-400"}`}
                    >
                      {milestone.status === "completed" ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : milestone.status === "in-progress" ? (
                        <Clock className="h-6 w-6 text-white" />
                      ) : (
                        <Target className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">${milestone.amount.toLocaleString()}</div>
                    <Badge
                      variant={
                        milestone.status === "completed"
                          ? "default"
                          : milestone.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {milestone.status === "completed"
                        ? "Completed"
                        : milestone.status === "in-progress"
                          ? "In Progress"
                          : "Pending"}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Backers */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Top Backers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {backers.map((backer, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {backer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{backer.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {backer.tier} Supporter
                      </Badge>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${backer.amount.toLocaleString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <CardHeader>
              <CardTitle className="text-2xl mb-4">Ready to Support Innovation?</CardTitle>
              <CardDescription className="text-lg">
                Join our community of supporters and help bring decentralized vending to the world.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Fund Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Mutual Vend. All rights reserved.</p>
      </footer>
    </div>
  )
}
