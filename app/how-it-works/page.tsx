"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Smartphone, CreditCard, Package, Coins, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { MermaidDiagram } from "@/components/mermaid-diagram"

export default function HowItWorksPage() {
  const flowChart = `
    graph TD
      A[User Approaches Machine] --> B[Scan QR Code]
      B --> C[Connect Wallet]
      C --> D[Select Product]
      D --> E[Approve Payment]
      E --> F[Confirm Transaction]
      F --> G[Product Dispensed]
      G --> H[Receive BREAD Tokens]
      
      style A fill:#e1f5fe
      style H fill:#e8f5e8
  `

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            🔧 How It Works
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Simple, Secure, Revolutionary</h1>
          <p className="text-xl text-gray-600">
            Discover how Mutual Vend combines cutting-edge blockchain technology with everyday convenience to create the
            future of vending.
          </p>
        </div>

        {/* Process Flow */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Purchase Process</CardTitle>
            <CardDescription>From selection to dispensing in just a few simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <MermaidDiagram chart={flowChart} className="w-full" />
          </CardContent>
        </Card>

        {/* Step by Step */}
        <div className="space-y-6 mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">Step-by-Step Guide</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Connect Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Use your mobile wallet to scan the QR code on the machine. We support MetaMask, WalletConnect, and
                  other popular wallets.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Choose Your Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Browse available products on the machine's interface. See real-time pricing, availability, and product
                  information.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Make Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pay with supported cryptocurrencies. The transaction is processed instantly on the blockchain for
                  maximum security and transparency.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Earn Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive BREAD tokens as rewards for your purchase. Use them for discounts, governance voting, or trade
                  them.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Technology Behind Mutual Vend</CardTitle>
            <CardDescription>Built on proven blockchain technology for security and transparency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Smart Contracts</h3>
                <p className="text-sm text-gray-600">
                  Automated, trustless transactions powered by Ethereum smart contracts
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">IoT Integration</h3>
                <p className="text-sm text-gray-600">Real-time inventory tracking and machine status monitoring</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Token Economics</h3>
                <p className="text-sm text-gray-600">
                  BREAD token rewards create a sustainable ecosystem for all participants
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Choose Blockchain Vending?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Instant Transactions</h4>
                    <p className="text-sm text-gray-600">No waiting for card processing or cash counting</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Global Accessibility</h4>
                    <p className="text-sm text-gray-600">Use the same wallet anywhere in the world</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Transparent Pricing</h4>
                    <p className="text-sm text-gray-600">All prices and fees visible on the blockchain</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Earn While You Spend</h4>
                    <p className="text-sm text-gray-600">Get BREAD tokens with every purchase</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Community Governance</h4>
                    <p className="text-sm text-gray-600">Vote on machine locations and product selection</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Enhanced Security</h4>
                    <p className="text-sm text-gray-600">Blockchain security eliminates fraud and chargebacks</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-4">Ready to Try It Yourself?</h3>
            <p className="text-gray-600 mb-6">Experience the future of vending with our live demo machine.</p>
            <Button size="lg" asChild>
              <Link href="/vending-machine">
                Try Demo Machine
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
