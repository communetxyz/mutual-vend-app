import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import { Smartphone, CreditCard, Package, CheckCircle, Zap, Shield, Users, TrendingUp, ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Connect Your Wallet",
    description: "Link your crypto wallet (MetaMask, WalletConnect, etc.) to the vending machine interface",
    icon: Smartphone,
    details: ["Supports major Web3 wallets", "Secure connection via QR code", "No personal data required"],
  },
  {
    number: "02",
    title: "Choose Your Product",
    description: "Browse available products and select what you want to purchase",
    icon: Package,
    details: ["Real-time inventory updates", "Transparent pricing", "Product information display"],
  },
  {
    number: "03",
    title: "Make Payment",
    description: "Pay with supported cryptocurrencies or stablecoins",
    icon: CreditCard,
    details: ["Multiple token support", "Automatic price conversion", "Low transaction fees"],
  },
  {
    number: "04",
    title: "Receive Your Item",
    description: "The machine dispenses your product after payment confirmation",
    icon: CheckCircle,
    details: ["Instant dispensing", "Transaction receipt", "Satisfaction guarantee"],
  },
]

const features = [
  {
    title: "Decentralized Network",
    description: "No single point of failure with blockchain-based operations",
    icon: Zap,
    benefits: ["24/7 availability", "Transparent operations", "Community governance"],
  },
  {
    title: "Privacy First",
    description: "Zero-knowledge verification protects your personal information",
    icon: Shield,
    benefits: ["Anonymous purchases", "Data sovereignty", "GDPR compliant"],
  },
  {
    title: "Cooperative Ownership",
    description: "Stakeholders share in the network's success and decision-making",
    icon: Users,
    benefits: ["Revenue sharing", "Voting rights", "Liquid ownership"],
  },
  {
    title: "Smart Economics",
    description: "AI-powered pricing and inventory management for optimal efficiency",
    icon: TrendingUp,
    benefits: ["Dynamic pricing", "Demand prediction", "Waste reduction"],
  },
]

const systemFlow = `
graph TD
    A["User Wallet"] --> B["Machine Interface"]
    B --> C["Product Selection"]
    C --> D["Payment Processing"]
    D --> E["Smart Contract"]
    E --> F["Payment Verification"]
    F --> G["Dispense Product"]
    G --> H["Transaction Complete"]
    
    I["Inventory System"] --> C
    J["Price Oracle"] --> D
    K["Revenue Pool"] --> L["Stakeholder Rewards"]
    E --> K
    
    M["Governance"] --> N["Network Decisions"]
    N --> O["Machine Updates"]
    
    style A fill:#e1f5fe
    style H fill:#c8e6c9
    style E fill:#fff3e0
    style M fill:#f3e5f5
`

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How It Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how our decentralized vending machine network combines blockchain technology with traditional
            retail to create a new paradigm for automated commerce.
          </p>
        </div>

        {/* Step-by-Step Process */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Simple 4-Step Process</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <Badge variant="outline" className="w-fit mx-auto mb-2">
                        Step {step.number}
                      </Badge>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-center mb-4">{step.description}</CardDescription>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* System Architecture */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">System Architecture</h2>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Flow</CardTitle>
              <CardDescription>How transactions flow through our decentralized network</CardDescription>
            </CardHeader>
            <CardContent>
              <MermaidDiagram chart={systemFlow} />
            </CardContent>
          </Card>
        </section>

        {/* Key Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="mt-1">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Specifications</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Infrastructure</CardTitle>
                <CardDescription>Built on robust and scalable blockchain technology</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium">Primary Chain</div>
                    <div className="text-sm text-muted-foreground">Gnosis Chain</div>
                  </div>
                  <div>
                    <div className="font-medium">Consensus</div>
                    <div className="text-sm text-muted-foreground">Proof of Stake</div>
                  </div>
                  <div>
                    <div className="font-medium">Transaction Speed</div>
                    <div className="text-sm text-muted-foreground">~5 seconds</div>
                  </div>
                  <div>
                    <div className="font-medium">Gas Fees</div>
                    <div className="text-sm text-muted-foreground">~$0.001</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Supported Tokens</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">XDAI</Badge>
                    <Badge variant="outline">USDC</Badge>
                    <Badge variant="outline">USDT</Badge>
                    <Badge variant="outline">WXDAI</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hardware Specifications</CardTitle>
                <CardDescription>Modern vending machines with IoT capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium">Display</div>
                    <div className="text-sm text-muted-foreground">21" Touchscreen</div>
                  </div>
                  <div>
                    <div className="font-medium">Connectivity</div>
                    <div className="text-sm text-muted-foreground">WiFi + 4G</div>
                  </div>
                  <div>
                    <div className="font-medium">Payment</div>
                    <div className="text-sm text-muted-foreground">Crypto + NFC</div>
                  </div>
                  <div>
                    <div className="font-medium">Capacity</div>
                    <div className="text-sm text-muted-foreground">200+ items</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Smart Features</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Real-time inventory tracking</li>
                    <li>• Temperature monitoring</li>
                    <li>• Remote diagnostics</li>
                    <li>• Energy efficiency optimization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Experience the future of automated retail. Find a machine near you or learn how to become part of our
                cooperative network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8">
                  Find a Machine
                </Button>
                <Button size="lg" variant="outline" className="px-8 bg-transparent">
                  Join the Network
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
