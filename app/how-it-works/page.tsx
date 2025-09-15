"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteNavigation } from "@/components/site-navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Coins,
  Wallet,
  PackageCheck,
  Shield,
  ArrowRight,
  CheckCircle,
  XCircle,
  TrendingUp,
  Diamond,
  Printer,
  Users,
  DollarSign,
  Vote,
  Rocket,
} from "lucide-react"

// Animation component for revenue sharing
function RevenueShareAnimation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [earnings, setEarnings] = useState(0)
  const [totalSales, setTotalSales] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3)
      if (currentStep === 1) {
        setTotalSales((prev) => prev + 1)
        setEarnings((prev) => prev + 0.05)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [currentStep])

  const steps = [
    { label: "You buy a snack", color: "bg-blue-500", icon: "🍿" },
    { label: "Earn rewards points", color: "bg-green-500", icon: "⭐" },
    { label: "Cash out rewards", color: "bg-yellow-500", icon: "💰" },
  ]

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 border-2 border-blue-200 dark:border-blue-800">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold mb-2">Live Rewards Program Simulation</h3>
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="text-sm">
              <span className="font-medium">Your Rewards:</span> ${earnings.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg transition-all duration-500 ${
                  index === currentStep ? step.color : "bg-gray-300"
                } ${index === currentStep ? "scale-110 shadow-lg" : ""}`}
              >
                {step.icon}
              </div>
              <div className="text-xs mt-2 text-center max-w-16">{step.label}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          {steps.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 mx-2 rounded transition-all duration-500 ${
                currentStep > index ? "bg-green-400" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {currentStep === 2 && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full text-green-700 dark:text-green-300 text-sm animate-pulse">
              <DollarSign className="h-4 w-4" />
              Ready to cash out rewards!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                How Mutual Vend Works
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Understanding the two cooperative mechanisms that power our shared vending network: community-verified
                stocking and automatic rewards sharing among consumers.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Built on Community Cooperation</h2>
              <p className="max-w-[800px] mx-auto text-gray-500 md:text-lg dark:text-gray-400">
                Mutual Vend creates a self-sustaining, consumer-owned retail network through two simple principles:
                shared responsibility for stocking machines and shared rewards from every purchase.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">The Cooperative Stocking System</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Consumers stake collateral to stock machines cooperatively, with other consumers voting to verify
                    the inventory, creating shared ownership and responsibility.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 mb-4">
                    <Coins className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">The Shared Rewards System</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Every purchase automatically earns you rewards that can be cashed out to stablecoins or used for
                    more machine purchases.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stocking Deep Dive */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 mb-4">
                Deep Dive #1
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Cooperative Stocking System</h2>
              <p className="max-w-[600px] mx-auto text-gray-500 md:text-lg dark:text-gray-400">
                How consumers work together to ensure machines are always stocked through collective verification
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold flex-shrink-0">
                  1
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Consumer Posts Collateral</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Any consumer wanting to stock a machine must first deposit collateral (stablecoins) into a smart
                    contract. This acts as a security deposit that ensures accountability to the cooperative.
                  </p>
                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">Cooperative Security:</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        The collateral amount exceeds the total value of the vending machine itself, ensuring stockers
                        have strong incentives to serve the cooperative honestly.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold flex-shrink-0">
                  2
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Physical Stocking</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    The consumer physically visits the machine and adds the promised products. They submit a stocking
                    request to the cooperative for verification.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <PackageCheck className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">What They Stock</span>
                        </div>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Snacks and beverages</li>
                          <li>• Exact quantities promised</li>
                          <li>• Quality products for the cooperative</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">Cooperative Process</span>
                        </div>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Submit stocking completion</li>
                          <li>• Request community verification</li>
                          <li>• Await cooperative approval</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold flex-shrink-0">
                  3
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Cooperative Verification</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Random consumers from the cooperative are selected to vote on whether the stocking was done
                    correctly. This creates a system of mutual accountability and shared governance.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="border-green-200 dark:border-green-800">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm text-green-700 dark:text-green-300">Vote: Approved</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Consumer gets collateral back and earns revenue from product sales when items are purchased.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-red-200 dark:border-red-800">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-sm text-red-700 dark:text-red-300">Vote: Rejected</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Collateral is used to address the restocking issue and ensure the cooperative's needs are met.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-200 dark:border-gray-800 my-12"></div>

        {/* Revenue Share Deep Dive */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 mb-4">
                Deep Dive #2
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Shared Rewards Cooperative</h2>
              <p className="max-w-[600px] mx-auto text-gray-500 md:text-lg dark:text-gray-400">
                How every purchase earns you rewards that can be cashed out to stablecoins or used for more purchases
              </p>
            </div>

            {/* Animation Section */}
            <div className="max-w-2xl mx-auto mb-12">
              <RevenueShareAnimation />
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white text-lg font-bold flex-shrink-0">
                  1
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">You Make a Cooperative Purchase</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    When you buy from a Mutual Vend machine, you're not just a customer—you're joining the cooperative.
                    Your payment is automatically split according to percentages that the cooperative votes on.
                  </p>
                  <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <CardContent className="pt-4">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Product Price:</span>
                          <span className="font-mono">100%</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>• Product Cost:</span>
                          <span className="font-mono">60%</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>• Cooperative Operations:</span>
                          <span className="font-mono">15%</span>
                        </div>
                        <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                          <span>• Your Rewards Share:</span>
                          <span className="font-mono">25%</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                          <Vote className="h-4 w-4" />
                          <span className="text-xs font-medium">Cooperative members vote on these percentages</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white text-lg font-bold flex-shrink-0">
                  2
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Earn Cooperative Rewards</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    You automatically earn rewards points from your purchase. Think of it like a rewards program that
                    lets you cash out to stablecoins (USDC, USDT) or use for more machine purchases.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Coins className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-sm">Rewards Program</span>
                        </div>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Machine Cooperative: #MV-001</li>
                          <li>• Rewards Value: 25% of purchase</li>
                          <li>• Instant earning</li>
                          <li>• Ready to cash out</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">Cashout Options</span>
                        </div>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Stablecoins (USDC, USDT)</li>
                          <li>• Machine credit for purchases</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white text-lg font-bold flex-shrink-0">
                  3
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Cash Out Your Rewards</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Your cooperative rewards are ready to cash out immediately. Choose to withdraw as stablecoins (USDC,
                    USDT) or keep as machine credit for future purchases. It's your choice how to use your rewards.
                  </p>
                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                        <Wallet className="h-4 w-4" />
                        <span className="font-medium">Simple Rewards Experience:</span>
                      </div>
                      <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                        <li>• Cash out to your preferred stablecoin</li>
                        <li>• Keep as machine credit for future purchases</li>
                        <li>• Instant withdrawal or seamless spending</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Aspects */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Learn More About Mutual Vend</h2>
              <p className="max-w-[600px] mx-auto text-gray-500 md:text-lg dark:text-gray-400">
                Now that you understand the core cooperative mechanisms, explore the additional features and
                opportunities that make Mutual Vend a complete ecosystem.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400 mb-3">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Liquid Ownership</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Discover how to buy and sell fractionalized cooperative ownership shares on a liquid marketplace.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/liquid-ownership">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400 mb-3">
                    <Diamond className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Lossless Lottery</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Learn about winning entire machines through fair cooperative auctions where everyone gets their
                    money back except the winner.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/lottery">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400 mb-3">
                    <Printer className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">3D Printing</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Explore how to download open-source blueprints and build your own cooperative vending machine.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/#blueprints">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 mb-3">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Funding Guide</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Learn how to crowdfund and deploy your own Mutual Vend machine in your community.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/funding">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Build Community Ownership Together?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Now that you understand how our consumer cooperative works, join fellow community members in creating a
                network where everyone shares in collective success and mutual prosperity.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-8">
                <Button size="lg">Join Our Community Cooperative</Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/#blueprints">Start Building Together</Link>
                </Button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Community-Owned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  <span>Shared Prosperity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Mutual Accountability</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Mutual Vend. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
