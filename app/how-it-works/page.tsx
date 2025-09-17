"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SiteNavigation } from "@/components/site-navigation"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import {
  Bot,
  Coins,
  Users,
  Shield,
  Zap,
  TrendingUp,
  ArrowRight,
  Smartphone,
  CreditCard,
  Gift,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  const processSteps = [
    {
      icon: Smartphone,
      title: "Connect Your Wallet",
      description: "Use any Web3 wallet to connect to the Gnosis Chain network",
    },
    {
      icon: Bot,
      title: "Find a Machine",
      description: "Locate nearby Mutual Vend machines using our interactive map",
    },
    {
      icon: CreditCard,
      title: "Make a Purchase",
      description: "Buy snacks using crypto tokens or BREAD community tokens",
    },
    {
      icon: Gift,
      title: "Earn Rewards",
      description: "Receive governance tokens and participate in revenue sharing",
    },
  ]

  const features = [
    {
      icon: Coins,
      title: "Multiple Payment Options",
      description: "Accept various cryptocurrencies and community tokens like BREAD",
      color: "text-yellow-500",
    },
    {
      icon: Users,
      title: "Community Ownership",
      description: "Machines are owned collectively by the community through tokenization",
      color: "text-blue-500",
    },
    {
      icon: Shield,
      title: "ZK Verification",
      description: "Privacy-preserving verification ensures secure and anonymous transactions",
      color: "text-green-500",
    },
    {
      icon: TrendingUp,
      title: "Revenue Sharing",
      description: "Token holders receive a share of machine profits automatically",
      color: "text-purple-500",
    },
    {
      icon: Zap,
      title: "Instant Transactions",
      description: "Fast, low-cost transactions powered by Gnosis Chain",
      color: "text-orange-500",
    },
    {
      icon: BarChart3,
      title: "Transparent Analytics",
      description: "Real-time data on machine performance and community metrics",
      color: "text-pink-500",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">How Mutual Vend Works</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover how our blockchain-powered vending machines create a new model for community-owned infrastructure
            and shared prosperity.
          </p>
        </div>

        {/* Process Steps */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Simple 4-Step Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="text-center relative">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <Badge variant="secondary" className="absolute top-4 right-4">
                      {index + 1}
                    </Badge>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{step.description}</CardDescription>
                  </CardContent>
                  {index < processSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-8 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* System Architecture */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">System Architecture</h2>
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Integration Flow</CardTitle>
              <CardDescription>How transactions flow through our decentralized vending machine network</CardDescription>
            </CardHeader>
            <CardContent>
              <MermaidDiagram
                chart={`
                graph TD
                    A[User Wallet] -->|Connect| B[Mutual Vend DApp]
                    B -->|Select Product| C[Vending Machine]
                    C -->|Check Inventory| D[Smart Contract]
                    D -->|Verify Payment| E[Token Contract]
                    E -->|Approve Transaction| F[Execute Purchase]
                    F -->|Dispense Product| C
                    F -->|Mint Rewards| G[Governance Token]
                    F -->|Distribute Revenue| H[Community Treasury]
                    G -->|Voting Rights| I[DAO Governance]
                    H -->|Revenue Share| J[Token Holders]
                `}
              />
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Technology Stack</CardTitle>
              <CardDescription>Built on cutting-edge blockchain and IoT technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Blockchain Layer
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Gnosis Chain for low-cost transactions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Smart contracts for machine logic
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      ERC-20 tokens for payments and governance
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Zero-knowledge proofs for privacy
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Hardware Layer
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      IoT-enabled vending machines
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Secure hardware wallets
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Real-time inventory tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Tamper-resistant design
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription>
                Experience the future of vending machines with our live demo on Gnosis Chain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/vending-machine">
                    <Bot className="h-5 w-5 mr-2" />
                    Try the Demo
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/funding">
                    <Coins className="h-5 w-5 mr-2" />
                    Support the Project
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect your wallet and make your first purchase with crypto or BREAD tokens
              </p>
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
