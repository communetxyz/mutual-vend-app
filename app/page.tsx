import { SiteNavigation } from "@/components/site-navigation"
import { WalletConnect } from "@/components/wallet-connect"
import { NetworkChecker } from "@/components/network-checker"
import { ProductGrid } from "@/components/product-grid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Users, Zap, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SiteNavigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Own a piece of the{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                vending machine
              </span>{" "}
              you use
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              3D-printable, crypto-powered, community-owned vending machines that reward users and shareholders alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vending-machine">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Try the Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Revolutionary Vending Experience</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Combining 3D printing, blockchain technology, and community ownership
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <Coins className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Crypto Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Pay with various cryptocurrencies including stablecoins and earn rewards with every purchase.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Shared Ownership</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Own liquid shares in vending machines and earn passive income from every transaction.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <Zap className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>3D Printable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Open-source designs that can be manufactured locally, reducing costs and environmental impact.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Transparent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All transactions and ownership records are publicly verifiable on the blockchain.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Try Our Interactive Demo</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Experience the future of vending machines with our Web3-powered prototype
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <NetworkChecker />
              </div>
              <div className="mb-8">
                <WalletConnect />
              </div>
              <ProductGrid />
            </div>

            <div className="space-y-6">
              <div className="relative">
                <Image
                  src="/futuristic-crypto-vending-machine.png"
                  alt="Futuristic crypto vending machine"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Connect Wallet</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Connect your Web3 wallet to start purchasing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Select Product</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Choose from available items in the machine
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Pay & Earn</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Pay with crypto and earn ownership rewards
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stocking Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Community-Driven Stocking Process</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Transparent and democratic inventory management</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <CardTitle className="text-blue-800 dark:text-blue-200">Community Proposal</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Shareholders propose new products and vote on inventory decisions through decentralized governance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <CardTitle className="text-purple-800 dark:text-purple-200">Automated Procurement</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                Smart contracts automatically purchase approved items when inventory runs low, ensuring continuous
                availability.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardHeader>
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <CardTitle className="text-green-800 dark:text-green-200">Local Fulfillment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-green-700 dark:text-green-300">
                Community members or service providers restock machines and earn rewards for maintenance activities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                4
              </div>
              <CardTitle className="text-orange-800 dark:text-orange-200">Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Profits are automatically distributed to shareholders based on their ownership percentage and
                participation.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join the Revolution?</h2>
          <p className="text-xl text-blue-100 mb-8">Start earning from vending machines in your community today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vending-machine">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Try Demo Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/funding">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Learn About Funding
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
