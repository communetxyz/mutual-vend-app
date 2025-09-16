import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteNavigation } from "@/components/site-navigation"
import { ArrowRight, Zap, Shield, Globe, Coins } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SiteNavigation />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            🚀 Now Live on Gnosis Chain
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Decentralized Vending
            <span className="text-blue-600 dark:text-blue-400"> Revolution</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            The world's first crypto-powered vending machine network. Buy snacks with cryptocurrency, earn rewards, and
            participate in a truly decentralized economy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/vending-machine">
                Try the Machine <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Instant Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Pay with cryptocurrency for instant, secure transactions without traditional payment processing delays.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Secure & Transparent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All transactions are recorded on the blockchain, ensuring complete transparency and security.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Global Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access vending machines worldwide with the same wallet and cryptocurrency.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Coins className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>Earn Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Participate in the network and earn tokens through purchases and community governance.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription>Connect your wallet and make your first crypto purchase today.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/vending-machine">
                  Launch App <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
