import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import { Shield, Eye, Lock, CheckCircle, AlertTriangle, Users, Clock, Zap, FileCheck, UserCheck } from "lucide-react"

const verificationStats = [
  {
    title: "Verified Users",
    value: "12,847",
    change: "+234 today",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    title: "Pending Verifications",
    value: "156",
    change: "Avg. 2 min processing",
    icon: Clock,
    color: "text-yellow-600",
  },
  {
    title: "Privacy Score",
    value: "99.8%",
    change: "Zero data breaches",
    icon: Shield,
    color: "text-blue-600",
  },
  {
    title: "Proofs Generated",
    value: "45,230",
    change: "This month",
    icon: FileCheck,
    color: "text-purple-600",
  },
]

const verificationLevels = [
  {
    level: "Basic Identity",
    description: "Prove you're a unique human without revealing personal details",
    requirements: ["Age verification (18+)", "Unique identity proof"],
    benefits: ["Access to basic features", "Standard transaction limits"],
    privacyLevel: "High",
    processingTime: "< 1 minute",
    status: "available",
  },
  {
    level: "Enhanced KYC",
    description: "Additional verification for higher limits while maintaining privacy",
    requirements: ["Income verification", "Address confirmation"],
    benefits: ["Higher transaction limits", "Premium features", "Reduced fees"],
    privacyLevel: "Medium",
    processingTime: "< 5 minutes",
    status: "available",
  },
  {
    level: "Institutional",
    description: "Enterprise-grade verification for business accounts",
    requirements: ["Business registration", "Compliance documentation"],
    benefits: ["Unlimited transactions", "API access", "Custom integrations"],
    privacyLevel: "Medium",
    processingTime: "< 30 minutes",
    status: "coming-soon",
  },
]

const zkProofFlow = `
graph TD
    A["User Data"] --> B["ZK Circuit"]
    B --> C["Generate Proof"]
    C --> D["Submit Proof"]
    D --> E["Verifier Contract"]
    E --> F{"Proof Valid?"}
    F -->|Yes| G["Verification Complete"]
    F -->|No| H["Verification Failed"]
    
    I["Private Inputs"] --> B
    J["Public Inputs"] --> B
    
    K["Original Data"] -.-> L["Never Leaves Device"]
    B --> M["Mathematical Proof"]
    M --> N["Zero Knowledge"]
    
    style A fill:#e1f5fe
    style G fill:#c8e6c9
    style H fill:#ffcdd2
    style L fill:#fff3e0
    style N fill:#f3e5f5
`

const privacyFeatures = [
  {
    title: "Zero-Knowledge Proofs",
    description: "Prove facts about yourself without revealing the underlying data",
    icon: Eye,
    benefits: [
      "Age verification without birthdate",
      "Income proof without exact amount",
      "Location confirmation without address",
    ],
  },
  {
    title: "Selective Disclosure",
    description: "Choose exactly what information to share for each verification",
    icon: Lock,
    benefits: ["Granular privacy controls", "Minimum data exposure", "User-controlled sharing"],
  },
  {
    title: "Decentralized Verification",
    description: "No central authority stores your personal information",
    icon: Shield,
    benefits: ["No single point of failure", "Reduced data breach risk", "User owns their data"],
  },
]

export default function ZKVerificationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Zero-Knowledge Verification</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Verify your identity and eligibility while maintaining complete privacy through advanced zero-knowledge
            proof technology. Prove what you need without revealing what you don't.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {verificationStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{stat.change}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="verify" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="verify">Get Verified</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Features</TabsTrigger>
            <TabsTrigger value="status">My Status</TabsTrigger>
          </TabsList>

          <TabsContent value="verify" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verificationLevels.map((level, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{level.level}</CardTitle>
                      {level.status === "coming-soon" ? (
                        <Badge variant="outline">Coming Soon</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                      )}
                    </div>
                    <CardDescription>{level.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {level.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {level.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Privacy Level</div>
                        <div className={`${level.privacyLevel === "High" ? "text-green-600" : "text-yellow-600"}`}>
                          {level.privacyLevel}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Processing</div>
                        <div className="text-muted-foreground">{level.processingTime}</div>
                      </div>
                    </div>

                    <Button className="w-full" disabled={level.status === "coming-soon"}>
                      {level.status === "coming-soon" ? "Coming Soon" : "Start Verification"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="how-it-works" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Zero-Knowledge Proof Process</CardTitle>
                <CardDescription>How we verify your identity without seeing your data</CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram chart={zkProofFlow} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>The Process</CardTitle>
                  <CardDescription>Step-by-step verification workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Submit Credentials</h4>
                      <p className="text-sm text-muted-foreground">
                        Provide your documents or data locally on your device
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Generate Proof</h4>
                      <p className="text-sm text-muted-foreground">
                        ZK circuits create mathematical proof of your claims
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Verify On-Chain</h4>
                      <p className="text-sm text-muted-foreground">
                        Smart contracts verify the proof without seeing your data
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Get Verified</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive verification status and unlock platform features
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                  <CardDescription>The cryptography behind zero-knowledge verification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">zk-SNARKs</h4>
                      <p className="text-sm text-muted-foreground">
                        Succinct non-interactive arguments of knowledge for efficient verification
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Circom Circuits</h4>
                      <p className="text-sm text-muted-foreground">
                        Custom circuits for different verification requirements
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Trusted Setup</h4>
                      <p className="text-sm text-muted-foreground">
                        Ceremony-generated parameters ensure system security
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Smart Contract Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        On-chain proof verification with gas-optimized contracts
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {privacyFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-blue-600" />
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Guarantees</CardTitle>
                <CardDescription>What we can and cannot see about you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-green-600 mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      What We Can Verify
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• You are over 18 years old</li>
                      <li>• You are a unique individual</li>
                      <li>• You meet income requirements</li>
                      <li>• You reside in an eligible country</li>
                      <li>• You have a valid government ID</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-red-600 mb-3 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      What We Cannot See
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Your exact age or birthdate</li>
                      <li>• Your name or personal details</li>
                      <li>• Your exact income amount</li>
                      <li>• Your specific address</li>
                      <li>• Your ID number or document</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-lg font-semibold text-green-600 mb-1">Verified</div>
                    <div className="text-sm text-muted-foreground">Basic Identity Level</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Limit</span>
                      <span className="font-medium">$500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Limit</span>
                      <span className="font-medium">$5,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Features</span>
                      <span className="font-medium">Basic</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upgrade Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600 mb-1">Enhanced KYC</div>
                    <div className="text-sm text-muted-foreground mb-3">Unlock higher limits</div>
                    <Button size="sm" className="w-full">
                      Upgrade Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Verification History</CardTitle>
                <CardDescription>Your verification timeline and proofs generated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Basic Identity Verification</div>
                        <div className="text-sm text-muted-foreground">Completed on March 15, 2024</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Age Verification Proof</div>
                        <div className="text-sm text-muted-foreground">Generated 47 proofs this month</div>
                      </div>
                    </div>
                    <Badge variant="outline">In Use</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Unique Identity Proof</div>
                        <div className="text-sm text-muted-foreground">Prevents duplicate accounts</div>
                      </div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
