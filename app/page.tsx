"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Coins, Users, ChevronRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit">
                  🚀 Now Live on Testnet
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  The Future of
                  <span className="text-blue-600"> Vending</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience the world's first decentralized vending machine platform. Purchase items with
                  cryptocurrency, earn rewards, and participate in cooperative ownership.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/vending-machine">
                    Try Demo <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  <Link href="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="/vending-machine-office-setup.png"
                alt="Modern vending machine setup with payment terminal in office environment"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Mutual Vend?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary technology meets everyday convenience. Experience the benefits of decentralized commerce
              with our innovative vending platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Instant Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Pay with cryptocurrency for instant, secure transactions without traditional payment processing
                  delays.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Secure & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Blockchain technology ensures every transaction is secure, transparent, and immutable.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Earn Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive BREAD tokens with every purchase and participate in our reward ecosystem.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Community Owned</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join a cooperative model where users have a say in machine placement and product selection.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience the Future?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users already using Mutual Vend for their daily purchases. Start earning rewards and be
            part of the decentralized commerce revolution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/vending-machine">
                Start Using Now <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/funding">Learn About Funding</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
