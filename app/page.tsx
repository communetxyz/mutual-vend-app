"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteNavigation } from "@/components/site-navigation"
import { Bot, Coins, Users, Shield, Zap, TrendingUp, ArrowRight, Play, ExternalLink, CheckCircle } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Bot,
      title: "Smart Vending Machines",
      description: "IoT-enabled machines that accept cryptocurrency payments and operate autonomously",
    },
    {
      icon: Users,
      title: "Community Ownership",
      description: "Collectively owned infrastructure where profits are shared among token holders",
    },
    {
      icon: Shield,
      title: "Zero-Knowledge Privacy",
      description: "Private transactions using ZK-proofs while maintaining transparency",
    },
    {
      icon: Coins,
      title: "Multi-Token Support",
      description: "Accept various cryptocurrencies and community tokens like BREAD",
    },
    {
      icon: TrendingUp,
      title: "Revenue Sharing",
      description: "Automatic profit distribution to community members and stakeholders",
    },
    {
      icon: Zap,
      title: "Instant Rewards",
      description: "Earn governance tokens and voting rights with every purchase",
    },
  ]

  const stats = [
    { label: "Active Machines", value: "12", suffix: "" },
    { label: "Total Transactions", value: "1.2", suffix: "K" },
    { label: "Community Members", value: "847", suffix: "" },
    { label: "Revenue Shared", value: "$5.2", suffix: "K" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Live on Gnosis Chain
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                The Future of
                <span className="text-primary"> Vending Machines</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl">
                Community-owned, blockchain-powered vending machines that reward users and share profits. Experience the
                next generation of autonomous commerce.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/vending-machine">
                  <Bot className="h-5 w-5 mr-2" />
                  Try the Demo
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/how-it-works">
                  <Play className="h-5 w-5 mr-2" />
                  How It Works
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No registration required • Connect any Web3 wallet</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 md:px-6 py-12 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Revolutionary Features</h2>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl mt-4">
              Built on cutting-edge blockchain technology to create a new model for shared infrastructure
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Demo Section */}
        <section className="border-t bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6 py-12 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline">Live Demo Available</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Experience It Yourself</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Our live demo on Gnosis Chain lets you experience the full functionality of Mutual Vend machines.
                    Connect your wallet, make purchases with crypto or BREAD tokens, and earn rewards.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Real blockchain transactions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Multiple payment options</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Instant reward distribution</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Community governance participation</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/vending-machine">
                      <Bot className="h-5 w-5 mr-2" />
                      Launch Demo
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/how-it-works">
                      Learn More
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                  <img
                    src="/futuristic-crypto-vending-machine.png"
                    alt="Futuristic Crypto Vending Machine"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Live on Gnosis Chain</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 md:px-6 py-12 md:py-24">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join the Revolution</h2>
                  <p className="mx-auto max-w-[600px] text-gray-600 dark:text-gray-400 text-lg">
                    Be part of the community that's building the future of autonomous commerce. Support the project,
                    earn rewards, and help shape the roadmap.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/funding">
                      <Coins className="h-5 w-5 mr-2" />
                      Support the Project
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="https://discord.gg/mutualvend" target="_blank" rel="noopener noreferrer">
                      <Users className="h-5 w-5 mr-2" />
                      Join Community
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="https://github.com/mutualvend"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </nav>
      </footer>
    </div>
  )
}
