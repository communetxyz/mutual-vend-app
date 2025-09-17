"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteNavigation } from "@/components/site-navigation"
import { DollarSign, Target, Users, Calendar, ExternalLink, TrendingUp, Wallet, Gift } from "lucide-react"

export default function FundingPage() {
  const fundingGoal = 50000
  const currentFunding = 32500
  const fundingProgress = (currentFunding / fundingGoal) * 100
  const daysLeft = 45

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 flex items-center justify-center gap-3">
            <DollarSign className="h-10 w-10" />
            Funding Campaign
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Help us build the future of decentralized vending machines. Support community-owned infrastructure that
            rewards everyone.
          </p>
        </div>

        {/* Funding Progress */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Campaign Progress</CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {daysLeft} days left
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Raised</span>
                  <span>{fundingProgress.toFixed(1)}% of goal</span>
                </div>
                <Progress value={fundingProgress} className="h-3" />
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${currentFunding.toLocaleString()}</span>
                  <span className="text-gray-500">of ${fundingGoal.toLocaleString()} goal</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">247</div>
                  <div className="text-sm text-gray-500">Backers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">65%</div>
                  <div className="text-sm text-gray-500">Funded</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">$132</div>
                  <div className="text-sm text-gray-500">Avg. Contribution</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1">
                  <Wallet className="h-5 w-5 mr-2" />
                  Back This Project
                </Button>
                <Button variant="outline" size="lg">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Share Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funding Tiers */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Funding Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Early Supporter",
                amount: 25,
                description: "Get early access to the platform and exclusive updates",
                rewards: ["Early access", "Exclusive updates", "Community Discord"],
                backers: 89,
              },
              {
                title: "Community Member",
                amount: 100,
                description: "Receive governance tokens and voting rights",
                rewards: ["All previous rewards", "Governance tokens", "Voting rights", "Beta testing access"],
                backers: 67,
                popular: true,
              },
              {
                title: "Machine Owner",
                amount: 500,
                description: "Co-own a vending machine and earn revenue share",
                rewards: ["All previous rewards", "Machine ownership share", "Revenue sharing", "Priority placement"],
                backers: 23,
              },
              {
                title: "Network Partner",
                amount: 1000,
                description: "Partner with us to deploy machines in your area",
                rewards: ["All previous rewards", "Partnership agreement", "Territory rights", "Custom branding"],
                backers: 12,
              },
              {
                title: "Ecosystem Builder",
                amount: 2500,
                description: "Help shape the future of the Mutual Vend ecosystem",
                rewards: ["All previous rewards", "Advisory board seat", "Product roadmap input", "Direct team access"],
                backers: 5,
              },
              {
                title: "Founding Investor",
                amount: 5000,
                description: "Become a founding investor with maximum benefits",
                rewards: ["All previous rewards", "Equity participation", "Board observer rights", "Lifetime benefits"],
                backers: 3,
              },
            ].map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? "border-primary border-2" : ""}`}>
                {tier.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {tier.title}
                    <span className="text-2xl font-bold">${tier.amount}</span>
                  </CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Rewards
                    </h4>
                    <ul className="text-sm space-y-1">
                      {tier.rewards.map((reward, rewardIndex) => (
                        <li key={rewardIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {reward}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{tier.backers} backers</span>
                    <span>Limited time</span>
                  </div>
                  <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                    Select This Tier
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use of Funds */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Use of Funds</CardTitle>
              <CardDescription>How we plan to use the funding to build the Mutual Vend network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    category: "Hardware Development",
                    percentage: 40,
                    amount: 20000,
                    description: "Design and manufacture the first generation of vending machines",
                  },
                  {
                    category: "Software Development",
                    percentage: 25,
                    amount: 12500,
                    description: "Build the blockchain infrastructure and mobile applications",
                  },
                  {
                    category: "Deployment & Operations",
                    percentage: 20,
                    amount: 10000,
                    description: "Deploy machines in strategic locations and operational costs",
                  },
                  {
                    category: "Marketing & Community",
                    percentage: 10,
                    amount: 5000,
                    description: "Build awareness and grow the community of users and partners",
                  },
                  {
                    category: "Legal & Compliance",
                    percentage: 5,
                    amount: 2500,
                    description: "Ensure regulatory compliance and intellectual property protection",
                  },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{item.category}</h4>
                      <div className="text-right">
                        <div className="font-bold">{item.percentage}%</div>
                        <div className="text-sm text-gray-500">${item.amount.toLocaleString()}</div>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                ))}
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
