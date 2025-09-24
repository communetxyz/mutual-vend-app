"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, Target, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function FundingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            💰 Funding Round Open
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Fund the Future of Vending</h1>
          <p className="text-xl text-gray-600">
            Join our mission to revolutionize vending machines with blockchain technology. Invest in Mutual Vend and be
            part of the decentralized commerce revolution.
          </p>
        </div>

        {/* Funding Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Funding Progress
            </CardTitle>
            <CardDescription>Current funding round: Seed Series A</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">$2.4M raised of $5M goal</span>
                <span className="text-sm text-gray-500">48% complete</span>
              </div>
              <Progress value={48} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$2.4M</div>
                <div className="text-sm text-gray-600">Raised</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600">Investors</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">42</div>
                <div className="text-sm text-gray-600">Days Left</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Tiers */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Supporter</CardTitle>
              <CardDescription>Perfect for individual investors</CardDescription>
              <div className="text-3xl font-bold">$1,000</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>• 100 BREAD tokens</li>
                <li>• Early access to machines</li>
                <li>• Community voting rights</li>
                <li>• Quarterly updates</li>
              </ul>
              <Button className="w-full">Invest Now</Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500 relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
            <CardHeader>
              <CardTitle>Partner</CardTitle>
              <CardDescription>For serious investors</CardDescription>
              <div className="text-3xl font-bold">$10,000</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>• 1,200 BREAD tokens (20% bonus)</li>
                <li>• Revenue sharing rights</li>
                <li>• Machine placement input</li>
                <li>• Direct team access</li>
                <li>• Beta testing privileges</li>
              </ul>
              <Button className="w-full">Invest Now</Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-gold-500">
            <CardHeader>
              <CardTitle>Founder</CardTitle>
              <CardDescription>Maximum impact investment</CardDescription>
              <div className="text-3xl font-bold">$50,000+</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>• 7,500+ BREAD tokens (50% bonus)</li>
                <li>• Board advisory position</li>
                <li>• Custom machine deployment</li>
                <li>• White-label opportunities</li>
                <li>• Exclusive founder events</li>
              </ul>
              <Button className="w-full">Contact Us</Button>
            </CardContent>
          </Card>
        </div>

        {/* Use of Funds */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Use of Funds
            </CardTitle>
            <CardDescription>How we'll use the investment to grow Mutual Vend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Hardware Development & Manufacturing</span>
                <span className="font-semibold">40%</span>
              </div>
              <Progress value={40} className="h-2" />

              <div className="flex justify-between items-center">
                <span>Software Development & Security</span>
                <span className="font-semibold">25%</span>
              </div>
              <Progress value={25} className="h-2" />

              <div className="flex justify-between items-center">
                <span>Market Expansion & Partnerships</span>
                <span className="font-semibold">20%</span>
              </div>
              <Progress value={20} className="h-2" />

              <div className="flex justify-between items-center">
                <span>Team Growth & Operations</span>
                <span className="font-semibold">15%</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Global Vending Market Size</span>
                <span className="font-semibold">$23.4B</span>
              </div>
              <div className="flex justify-between">
                <span>Expected CAGR (2024-2029)</span>
                <span className="font-semibold">9.2%</span>
              </div>
              <div className="flex justify-between">
                <span>Crypto Payment Adoption</span>
                <span className="font-semibold">+156%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Traction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Pilot Machines Deployed</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Transactions</span>
                <span className="font-semibold">2,400+</span>
              </div>
              <div className="flex justify-between">
                <span>Partner Locations</span>
                <span className="font-semibold">8</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-4">Ready to Invest in the Future?</h3>
            <p className="text-gray-600 mb-6">
              Join leading investors who believe in the future of decentralized commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Start Investment Process
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/revenue-share">Learn About Returns</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
