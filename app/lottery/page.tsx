import { SiteNavigation } from "@/components/site-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Ticket,
  Trophy,
  Calendar,
  Users,
  Coins,
  ArrowRight,
  CheckCircle,
  Clock,
  Gift,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react"

export default function LotteryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4 flex items-center justify-center gap-3">
            <Ticket className="h-10 w-10 text-purple-600" />
            Mutual Vend Lottery
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Every purchase is a chance to win! Automatic lottery entries with every vending machine transaction
          </p>
        </div>

        {/* Current Jackpot */}
        <Card className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <Trophy className="h-16 w-16 mx-auto" />
              <div>
                <div className="text-sm opacity-90">Current Weekly Jackpot</div>
                <div className="text-5xl font-bold">$2,847</div>
                <div className="text-sm opacity-90">in USDC</div>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>3 days remaining</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>1,247 entries</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              How the Lottery Works
            </CardTitle>
            <CardDescription>Automatic entries with every purchase - no additional cost!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Lottery Process</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">1</span>
                      </div>
                      <div>
                        <div className="font-medium">Purchase from Machine</div>
                        <div className="text-gray-600 dark:text-gray-400">Every purchase earns entries</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">2</span>
                      </div>
                      <div>
                        <div className="font-medium">Automatic Entry</div>
                        <div className="text-gray-600 dark:text-gray-400">No additional steps required</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-pink-600">3</span>
                      </div>
                      <div>
                        <div className="font-medium">Weekly Draw</div>
                        <div className="text-gray-600 dark:text-gray-400">Fair random selection</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-pink-600">4</span>
                      </div>
                      <div>
                        <div className="font-medium">Prize Distribution</div>
                        <div className="text-gray-600 dark:text-gray-400">Instant payout to winners</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prize Tiers */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Weekly Draw
              </CardTitle>
              <CardDescription>Every Sunday at 8 PM UTC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">$500 - $5,000</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Prize Range</div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">1st Place</span>
                  <span className="text-sm font-medium">60% of pool</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">2nd Place</span>
                  <span className="text-sm font-medium">25% of pool</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">3rd Place</span>
                  <span className="text-sm font-medium">15% of pool</span>
                </div>
              </div>
              <div className="text-center pt-2">
                <Badge variant="secondary">3 Winners</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-600" />
                Monthly Mega
              </CardTitle>
              <CardDescription>First Sunday of each month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">$2,000 - $20,000</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Prize Range</div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Grand Prize</span>
                  <span className="text-sm font-medium">40% of pool</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Runner-ups (5)</span>
                  <span className="text-sm font-medium">40% of pool</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Consolation (10)</span>
                  <span className="text-sm font-medium">20% of pool</span>
                </div>
              </div>
              <div className="text-center pt-2">
                <Badge>16 Winners</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                Special Events
              </CardTitle>
              <CardDescription>Holiday and milestone draws</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$10,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Prize Range</div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Holiday bonuses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Milestone celebrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Community events</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Partnership prizes</span>
                </div>
              </div>
              <div className="text-center pt-2">
                <Badge variant="destructive">Variable</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Entry Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              How to Enter
            </CardTitle>
            <CardDescription>Multiple ways to earn lottery entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <Coins className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold">Purchase Items</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1 entry per $1 spent</p>
                <Badge variant="secondary">Automatic</Badge>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold">Refer Friends</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">5 bonus entries per referral</p>
                <Badge variant="secondary">Bonus</Badge>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold">Hold Tokens</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1 entry per 100 tokens held</p>
                <Badge variant="secondary">Passive</Badge>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-8 w-8 text-yellow-600" />
                </div>
                <h4 className="font-semibold">Daily Check-in</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1 entry per day</p>
                <Badge variant="secondary">Daily</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Winners */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recent Winners
            </CardTitle>
            <CardDescription>Congratulations to our latest lottery winners!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  <div>
                    <div className="font-semibold">0x7a2f...8b4c</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Weekly Draw #47</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-600">$1,847 USDC</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">2 days ago</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="font-semibold">0x9c1e...3f7a</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Mega #12</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600">$8,234 USDC</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">1 week ago</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-3">
                  <Gift className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-semibold">0x4d8b...9e2f</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Holiday Special</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">$15,000 USDC</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">3 weeks ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Entries */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Your Lottery Status
            </CardTitle>
            <CardDescription>Connect your wallet to view your entries and chances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Ticket className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connect Wallet to View Entries</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                See your current entries, win history, and chances for upcoming draws
              </p>
              <Button size="lg">
                Connect Wallet
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rules & Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Lottery Rules & Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Eligibility</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Must be 18+ years old</li>
                  <li>• Valid wallet address required</li>
                  <li>• Minimum $1 purchase for entry</li>
                  <li>• No geographic restrictions</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Prize Distribution</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Automatic distribution to winners</li>
                  <li>• Prizes paid in USDC</li>
                  <li>• No claiming period - instant payout</li>
                  <li>• Winners announced publicly</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Fair Play</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Provably fair random selection</li>
                  <li>• Blockchain-verified draws</li>
                  <li>• Open source lottery contract</li>
                  <li>• Community oversight</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Entry Limits</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• No maximum entries per person</li>
                  <li>• Entries expire after draw</li>
                  <li>• Bonus entries stack with purchases</li>
                  <li>• Historical entries tracked</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
