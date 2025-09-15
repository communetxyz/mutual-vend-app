import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Rocket,
  DollarSign,
  Users,
  Printer,
  Coins,
  TrendingUp,
  Shield,
  Package,
  Zap,
  CheckCircle,
  Calculator,
  PieChart,
  Diamond,
} from "lucide-react"
import { SiteNavigation } from "@/components/site-navigation"
import Link from "next/link"

export default function FundingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Funding Guide
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Fund Your Own Mutual Vend Machine
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Learn how to crowdfund, build, and deploy your own open-source 3D-printed crypto vending machine with
                all the Mutual Vend cooperative features built-in.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Complete Funding & Deployment Package
              </h2>
              <p className="max-w-[800px] mx-auto text-gray-500 md:text-lg dark:text-gray-400">
                Everything you need to launch a fully-featured Mutual Vend machine in your community, from initial
                funding to ongoing revenue generation.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 mb-4">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Crowdfunding</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Raise funds from your community through crypto crowdfunding, pre-sales, and cooperative investment
                    models.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 mb-4">
                    <Printer className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Manufacturing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    3D print and assemble your machine using open-source blueprints, with detailed guides and community
                    support.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400 mb-4">
                    <Rocket className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Deployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Launch with full Mutual Vend features: revenue sharing, community stocking, and cooperative
                    governance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Funding Models */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Funding Models</h2>
              <p className="max-w-[600px] mx-auto text-gray-500 md:text-lg dark:text-gray-400">
                Choose the funding approach that works best for your community and location
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
              {/* Community Crowdfunding */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Most Popular
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                      <Users className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Community Crowdfunding</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    Pool resources from community members who want a vending machine in their area. Contributors become
                    stakeholders with revenue sharing rights.
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-semibold">How it works:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Set funding goal ($2,000 - $5,000)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Community contributes crypto (USDC, ETH, etc.)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Contributors receive revenue-sharing tokens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Machine generates ongoing returns</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">Expected Returns</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Contributors typically see 15-25% annual returns through revenue sharing, plus potential token
                      appreciation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Lossless Lottery */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                      <Diamond className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Lossless Lottery Funding</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    Community members deposit funds into a yield-generating pool. One winner gets the machine, everyone
                    else gets their money back.
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-semibold">How it works:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span>Participants deposit equal amounts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span>Funds earn yield during lottery period</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span>Random winner selected fairly</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span>Non-winners get deposits back</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 mb-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">No-Loss Guarantee</span>
                    </div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Perfect for risk-averse communities. Everyone gets their money back except the lucky winner who
                      gets the machine.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Cost Breakdown</h2>
              <p className="max-w-[600px] mx-auto text-gray-500 md:text-lg dark:text-gray-400">
                Transparent pricing for all components needed to build and deploy your machine
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Total Project Cost: $3,200 - $4,800
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Hardware Costs */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Hardware & Materials
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>3D Printing Materials (PLA/PETG)</span>
                          <span className="font-mono">$200 - $300</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Electronics (Raspberry Pi, sensors, etc.)</span>
                          <span className="font-mono">$400 - $600</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mechanical Components (motors, springs)</span>
                          <span className="font-mono">$300 - $500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Hardware (NFC, QR scanner)</span>
                          <span className="font-mono">$150 - $250</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Enclosure & Security</span>
                          <span className="font-mono">$200 - $400</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Hardware Subtotal:</span>
                          <span className="font-mono">$1,250 - $2,050</span>
                        </div>
                      </div>
                    </div>

                    {/* Software & Services */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Software & Services
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Smart Contract Deployment</span>
                          <span className="font-mono">$50 - $100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Initial Token Supply (BREAD)</span>
                          <span className="font-mono">$500 - $1,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Initial Inventory Stock</span>
                          <span className="font-mono">$300 - $500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Installation & Setup</span>
                          <span className="font-mono">$200 - $300</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Insurance & Permits</span>
                          <span className="font-mono">$150 - $250</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Marketing & Launch</span>
                          <span className="font-mono">$100 - $200</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Services Subtotal:</span>
                          <span className="font-mono">$1,300 - $2,350</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                      <PieChart className="h-4 w-4" />
                      <span className="font-medium">ROI Projection</span>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      With average daily sales of $50-100, most machines pay back their initial investment within 12-18
                      months, then generate ongoing profits for the community.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Included */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                All Mutual Vend Features Included
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-500 md:text-lg dark:text-gray-400">
                Your funded machine comes with the complete Mutual Vend cooperative ecosystem
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                      <Coins className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Revenue Sharing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Every purchase automatically distributes rewards to recent customers, creating a self-sustaining
                    incentive system.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Community Stocking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Decentralized stocking system where community members can restock machines and earn rewards,
                    verified by other users.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Liquid Ownership</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fractionalized ownership tokens that can be bought and sold, allowing dynamic investment in machine
                    performance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Crypto Payments</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Accept multiple cryptocurrencies and stablecoins with automatic conversion and low transaction fees.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                      <Package className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Smart Inventory</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Real-time inventory tracking with automated restock alerts and community-driven product selection.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
                      <Zap className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">DAO Governance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Token-based voting system for machine upgrades, product selection, and revenue distribution
                    decisions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Ready to Get Started?</h2>
              <p className="max-w-[600px] mx-auto text-gray-500 md:text-lg dark:text-gray-400">
                Join the growing network of community-owned vending machines
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mx-auto">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Choose Your Model</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Select crowdfunding or lottery funding based on your community's preferences
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mx-auto">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Launch Campaign</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Set up your funding campaign and start collecting contributions from your community
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mx-auto">
                    3
                  </div>
                  <h3 className="text-xl font-bold">Build & Deploy</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    3D print, assemble, and deploy your machine with full community support
                  </p>
                </div>
              </div>

              <div className="text-center mt-12 space-y-4">
                <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Rocket className="h-4 w-4 mr-2" />
                    Start Your Campaign
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/#blueprints">
                      <Printer className="h-4 w-4 mr-2" />
                      View Blueprints
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Need help? Join our community Discord for guidance and support from other machine builders.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Mutual Vend. All rights reserved.</p>
      </footer>
    </div>
  )
}
