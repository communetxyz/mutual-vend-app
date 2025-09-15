import { SiteNavigation } from "@/components/site-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import {
  Shield,
  Eye,
  Lock,
  CheckCircle,
  Zap,
  ArrowRight,
  AlertTriangle,
  Key,
  FileCheck,
  Globe,
  Cpu,
} from "lucide-react"

export default function ZKVerificationPage() {
  const zkFlowChart = `
    graph TD
        A["User Purchase"] --> B["Generate ZK Proof"]
        B --> C["Verify Age/Location"]
        C --> D["Proof Validation"]
        D --> E["Transaction Approved"]
        E --> F["Product Dispensed"]
        
        G["Privacy Preserved"] --> H["No Personal Data Stored"]
        H --> I["Compliance Maintained"]
        I --> J["Regulatory Approval"]
        
        B --> G
        D --> K["Audit Trail"]
        K --> L["Regulatory Reporting"]
  `

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 flex items-center justify-center gap-3">
            <Shield className="h-10 w-10 text-green-600" />
            ZK Verification System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Privacy-preserving age and location verification using zero-knowledge proofs
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Complete Privacy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verify eligibility without revealing personal information
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Regulatory Compliance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Meet age restrictions and location requirements
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Instant Verification</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fast, automated verification process</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              How ZK Verification Works
            </CardTitle>
            <CardDescription>Privacy-first verification using cryptographic proofs</CardDescription>
          </CardHeader>
          <CardContent>
            <MermaidDiagram chart={zkFlowChart} />
          </CardContent>
        </Card>

        {/* Verification Types */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Age Verification
              </CardTitle>
              <CardDescription>Prove you're over 18 without revealing your exact age</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">No birth date storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Government ID integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">One-time verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Cryptographic proof</span>
                </div>
              </div>
              <Separator />
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Required for:</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Alcohol, tobacco, and age-restricted products
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Location Verification
              </CardTitle>
              <CardDescription>Confirm your location without GPS tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">No GPS data collection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">IP-based verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Jurisdiction compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Real-time validation</span>
                </div>
              </div>
              <Separator />
              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Required for:</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  Region-specific products and legal compliance
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Implementation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Technical Implementation
            </CardTitle>
            <CardDescription>Built on proven zero-knowledge cryptography</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold">ZK-SNARK Protocol</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Succinct non-interactive proofs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Zero knowledge property</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Computational soundness</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Perfect completeness</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Security Features</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Tamper-proof verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Replay attack prevention</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Cryptographic integrity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Audit trail generation</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Guarantees */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy Guarantees
            </CardTitle>
            <CardDescription>What we know vs. what we don't know about you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <h4 className="font-semibold">What We Verify</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="font-medium">Age Eligibility</div>
                    <div className="text-gray-600 dark:text-gray-400">You are over the required age</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="font-medium">Location Compliance</div>
                    <div className="text-gray-600 dark:text-gray-400">You are in an allowed jurisdiction</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="font-medium">Identity Authenticity</div>
                    <div className="text-gray-600 dark:text-gray-400">Your credentials are valid</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <h4 className="font-semibold">What We Don't Know</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="font-medium">Your Exact Age</div>
                    <div className="text-gray-600 dark:text-gray-400">Birth date remains private</div>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="font-medium">Your Precise Location</div>
                    <div className="text-gray-600 dark:text-gray-400">GPS coordinates not collected</div>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="font-medium">Your Personal Details</div>
                    <div className="text-gray-600 dark:text-gray-400">Name, address, ID numbers</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Regulations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Regulatory Compliance
            </CardTitle>
            <CardDescription>Meeting legal requirements while preserving privacy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold">GDPR Compliant</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">European data protection standards</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold">CCPA Aligned</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">California privacy regulations</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                  <FileCheck className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold">Industry Standards</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Age verification best practices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Getting Verified
            </CardTitle>
            <CardDescription>Simple one-time setup for privacy-preserving verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold">Connect Wallet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Link your crypto wallet to the verification system
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold">Provide Credentials</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Submit government ID for one-time verification
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-semibold">Generate Proof</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">System creates your privacy-preserving proof</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600">4</span>
                </div>
                <h4 className="font-semibold">Start Shopping</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access age-restricted products with verified status
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" className="px-8">
                Begin Verification
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Verification takes less than 2 minutes</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
