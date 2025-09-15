import { SiteNavigation } from "@/components/site-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Wrench,
  Cpu,
  Zap,
  Shield,
  Coins,
  CheckCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react"

export default function FabricationResearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 flex items-center justify-center gap-3">
            <Wrench className="h-10 w-10 text-blue-600" />
            Fabrication Research
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive analysis of vending machine manufacturing approaches, costs, and implementation strategies
          </p>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">$2,500 - $8,000</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Unit Cost</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">3-6 months</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Development Timeline</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">High</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Market Viability</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manufacturing Approaches */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Custom Manufacturing
              </CardTitle>
              <CardDescription>Build from scratch with specialized components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Complete control over design</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Optimized for crypto payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Integrated blockchain features</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Higher development costs</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Longer time to market</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Estimated Cost:</span>
                  <span className="text-sm">$5,000 - $8,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Timeline:</span>
                  <span className="text-sm">4-6 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Complexity:</span>
                  <Badge variant="destructive">High</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Retrofit Existing
              </CardTitle>
              <CardDescription>Modify existing vending machines with crypto capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Lower initial investment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Faster deployment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Proven mechanical systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Limited customization</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Integration challenges</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Estimated Cost:</span>
                  <span className="text-sm">$2,500 - $4,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Timeline:</span>
                  <span className="text-sm">2-4 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Complexity:</span>
                  <Badge variant="secondary">Medium</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Components */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Key Components & Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Computing Hardware
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Raspberry Pi 4 or equivalent</li>
                  <li>• 32GB+ storage</li>
                  <li>• WiFi/Ethernet connectivity</li>
                  <li>• Backup power system</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Features
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Hardware wallet integration</li>
                  <li>• Secure enclosure</li>
                  <li>• Tamper detection</li>
                  <li>• Encrypted communications</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Payment Systems
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• QR code scanner</li>
                  <li>• NFC reader</li>
                  <li>• Display screen</li>
                  <li>• Multi-chain support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Detailed Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">Custom Build Costs</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Mechanical components</span>
                      <span>$2,000 - $3,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Computing hardware</span>
                      <span>$300 - $500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment systems</span>
                      <span>$400 - $600</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security features</span>
                      <span>$200 - $400</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assembly & testing</span>
                      <span>$500 - $800</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>$3,400 - $5,800</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Retrofit Costs</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base vending machine</span>
                      <span>$1,500 - $2,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Computing hardware</span>
                      <span>$300 - $500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment integration</span>
                      <span>$400 - $600</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modification labor</span>
                      <span>$300 - $500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Testing & certification</span>
                      <span>$200 - $300</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>$2,700 - $4,400</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Roadmap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Implementation Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Research & Design (Month 1)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Finalize specifications, source components, create detailed blueprints
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Prototype Development (Months 2-3)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Build initial prototype, test core functionality, iterate on design
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Integration & Testing (Month 4)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Integrate blockchain features, conduct security audits, performance testing
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Pilot Deployment (Months 5-6)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Deploy pilot units, gather user feedback, refine operations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Recommended Approach: Hybrid Strategy
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Start with retrofitting existing machines for rapid market entry, then develop custom units based on
                learnings and demand.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Phase 1: Retrofit (Months 1-3)</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Deploy 3-5 retrofit units</li>
                  <li>• Test market acceptance</li>
                  <li>• Gather operational data</li>
                  <li>• Refine software platform</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Phase 2: Custom Build (Months 4-8)</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Develop custom hardware</li>
                  <li>• Optimize for crypto payments</li>
                  <li>• Scale manufacturing</li>
                  <li>• Expand deployment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
