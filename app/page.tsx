import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteNavigation } from "@/components/site-navigation"
import { Bot, Coins, Users, Zap, ArrowRight, Package, Shield, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    The Future of Vending is Here
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Mutual Vend combines cryptocurrency payments with community ownership. Buy snacks, earn rewards, and
                    participate in the decentralized economy.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/vending-machine">
                    <Button size="lg" className="inline-flex items-center justify-center">
                      Try the Machine
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/futuristic-crypto-vending-machine.png"
                  alt="Futuristic Crypto Vending Machine"
                  className="aspect-square overflow-hidden rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Revolutionary Vending Experience</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Experience the next generation of vending machines with crypto payments, community ownership, and
                  automated rewards.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Coins className="h-10 w-10 text-blue-500" />
                  <CardTitle>Crypto Payments</CardTitle>
                  <CardDescription>
                    Pay with your favorite cryptocurrencies on Gnosis Chain. Fast, secure, and decentralized
                    transactions.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-green-500" />
                  <CardTitle>Community Ownership</CardTitle>
                  <CardDescription>
                    Own a piece of the vending machine through liquid ownership tokens. Participate in governance and
                    earn revenue share.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="h-10 w-10 text-purple-500" />
                  <CardTitle>Automated Rewards</CardTitle>
                  <CardDescription>
                    Earn rewards automatically with every purchase. Participate in lotteries and cashback programs.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Package className="h-12 w-12 text-blue-500" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">24/7 Availability</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Access snacks and beverages anytime with our automated vending system.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Shield className="h-12 w-12 text-green-500" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Secure Transactions</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    All transactions are secured by blockchain technology and smart contracts.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <TrendingUp className="h-12 w-12 text-purple-500" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Growing Network</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Join a growing network of crypto-enabled vending machines worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Connect your wallet and start purchasing from our crypto vending machine today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/vending-machine">
                  <Button size="lg">
                    <Bot className="mr-2 h-4 w-4" />
                    Try Now
                  </Button>
                </Link>
                <Link href="/funding">
                  <Button variant="outline" size="lg">
                    Learn About Funding
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Mutual Vend. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/how-it-works">
            How It Works
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/funding">
            Funding
          </Link>
        </nav>
      </footer>
    </div>
  )
}
