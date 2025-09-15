import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, Shield, Users, TrendingUp, ShoppingCart, Coins, Globe, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant Crypto Payments",
    description: "Pay with your favorite cryptocurrencies and stablecoins. Fast, secure, and borderless transactions.",
  },
  {
    icon: Shield,
    title: "Zero-Knowledge Privacy",
    description:
      "Verify your identity without revealing personal data. Complete privacy through advanced cryptography.",
  },
  {
    icon: Users,
    title: "Cooperative Ownership",
    description: "Own a piece of the network. Stakeholders share in revenue and governance decisions.",
  },
  {
    icon: TrendingUp,
    title: "Passive Income",
    description: "Earn regular dividends from network revenue. Multiple income streams from a growing ecosystem.",
  },
]

const stats = [
  { label: "Active Machines", value: "156", suffix: "" },
  { label: "Total Transactions", value: "45.2", suffix: "K" },
  { label: "Network Revenue", value: "$127", suffix: "K" },
  { label: "Community Members", value: "2.8", suffix: "K" },
]

const benefits = [
  "24/7 availability with blockchain reliability",
  "Lower fees than traditional payment systems",
  "Transparent operations and revenue sharing",
  "Community-driven governance and development",
  "Privacy-preserving identity verification",
  "Liquid ownership with secondary markets",
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="w-fit bg-blue-100 text-blue-800 hover:bg-blue-200">🚀 Now Live on Gnosis Chain</Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  The Future of
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}
                    Vending Machines
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  A decentralized network of smart vending machines powered by blockchain technology. Buy products with
                  crypto, earn from network success, and help shape the future of automated retail.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8" asChild>
                  <Link href="/vending-machine">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Start Shopping
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 bg-transparent" asChild>
                  <Link href="/how-it-works">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No KYC Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Instant Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Earn Rewards</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/futuristic-crypto-vending-machine.png"
                  alt="Futuristic Crypto Vending Machine"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-3xl opacity-20 transform scale-105"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Mutual Vend?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're revolutionizing automated retail with blockchain technology, creating new opportunities for
              consumers, investors, and entrepreneurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for the Decentralized Future</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our network combines the convenience of traditional vending machines with the power of blockchain
                technology, creating unprecedented opportunities for participation and ownership.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/liquid-ownership">
                    <Users className="mr-2 h-5 w-5" />
                    Join the Cooperative
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/vending-machine-prototype-2.png"
                alt="Vending Machine Prototype"
                width={500}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already enjoying crypto-powered vending machines. Start shopping, earning,
            and participating in the decentralized economy today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8" asChild>
              <Link href="/vending-machine">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Try a Machine
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/funding">
                <Coins className="mr-2 h-5 w-5" />
                Invest Now
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-sm opacity-75">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Global Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Lightning Fast</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
