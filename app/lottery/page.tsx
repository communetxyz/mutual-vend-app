import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import { Trophy, Calendar, Users, Clock, Gift, Star, TrendingUp, Zap } from "lucide-react"

const lotteryStats = [
  {
    title: "Current Jackpot",
    value: "$12,450",
    change: "+$2,340",
    icon: Trophy,
    color: "text-yellow-600",
  },
  {
    title: "Total Participants",
    value: "1,847",
    change: "+156 today",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Draws This Month",
    value: "8",
    change: "Next in 2 days",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    title: "Total Prizes Won",
    value: "$89,230",
    change: "All time",
    icon: Gift,
    color: "text-purple-600",
  },
]

const upcomingDraws = [
  {
    id: 1,
    name: "Weekly Jackpot",
    prize: "$12,450",
    participants: 1847,
    timeLeft: "2 days, 14 hours",
    ticketPrice: "$5",
    odds: "1 in 1,847",
  },
  {
    id: 2,
    name: "Daily Quick Draw",
    prize: "$500",
    participants: 234,
    timeLeft: "18 hours",
    ticketPrice: "$1",
    odds: "1 in 234",
  },
  {
    id: 3,
    name: "Monthly Mega Prize",
    prize: "$50,000",
    participants: 3456,
    timeLeft: "12 days",
    ticketPrice: "$10",
    odds: "1 in 3,456",
  },
]

const recentWinners = [
  {
    address: "0x1234...5678",
    prize: "$12,450",
    draw: "Weekly Jackpot #47",
    date: "2 days ago",
  },
  {
    address: "0x8765...4321",
    prize: "$500",
    draw: "Daily Quick Draw #156",
    date: "1 day ago",
  },
  {
    address: "0x9876...1234",
    prize: "$250",
    draw: "Daily Quick Draw #155",
    date: "2 days ago",
  },
]

const lotteryFlowChart = `
graph TD
    A["Purchase Tickets"] --> B["Ticket Pool"]
    B --> C["Random Draw"]
    C --> D["Winner Selection"]
    D --> E["Prize Distribution"]
    E --> F["Winner Receives Prize"]
    
    G["Ticket Sales"] --> H["Prize Pool 70%"]
    G --> I["Platform Fee 10%"]
    G --> J["Next Draw 20%"]
    
    H --> E
    J --> K["Future Jackpots"]
    
    L["Smart Contract"] --> C
    L --> M["Verifiable Randomness"]
    M --> N["Transparent Results"]
    
    style A fill:#e1f5fe
    style F fill:#c8e6c9
    style L fill:#fff3e0
    style N fill:#f3e5f5
`

export default function LotteryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Community Lottery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Participate in transparent, blockchain-based lottery draws with verifiable randomness and automatic prize
            distribution. Every purchase contributes to the community jackpot.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {lotteryStats.map((stat, index) => {
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

        <Tabs defaultValue="draws" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="draws">Active Draws</TabsTrigger>
            <TabsTrigger value="winners">Recent Winners</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            <TabsTrigger value="history">My History</TabsTrigger>
          </TabsList>

          <TabsContent value="draws" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingDraws.map((draw) => (
                <Card key={draw.id} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-400 to-yellow-600 rounded-bl-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg pr-16">{draw.name}</CardTitle>
                    <CardDescription>
                      Draw #{draw.id} • {draw.participants} participants
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">{draw.prize}</div>
                      <div className="text-sm text-muted-foreground">Current Prize Pool</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Time Left</div>
                        <div className="text-muted-foreground">{draw.timeLeft}</div>
                      </div>
                      <div>
                        <div className="font-medium">Ticket Price</div>
                        <div className="text-muted-foreground">{draw.ticketPrice}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="font-medium">Your Odds</div>
                        <div className="text-muted-foreground">{draw.odds}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tickets Sold</span>
                        <span>{draw.participants} / ∞</span>
                      </div>
                      <Progress value={Math.min((draw.participants / 2000) * 100, 100)} className="h-2" />
                    </div>

                    <Button className="w-full">Buy Tickets</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="winners" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Winners</CardTitle>
                <CardDescription>Latest lottery winners and their prizes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentWinners.map((winner, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{winner.address}</div>
                          <div className="text-sm text-muted-foreground">
                            {winner.draw} • {winner.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{winner.prize}</div>
                        <Badge variant="outline">Winner</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Biggest Win This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">$50,000</div>
                    <div className="text-sm text-muted-foreground">Monthly Mega Prize #12</div>
                    <div className="text-xs text-muted-foreground mt-1">Won by 0x9876...5432</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Frequent Winner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">7 Wins</div>
                    <div className="text-sm text-muted-foreground">0x1234...7890</div>
                    <div className="text-xs text-muted-foreground mt-1">Total winnings: $8,450</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lucky Numbers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="flex justify-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                        7
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold">
                        23
                      </div>
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold">
                        42
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Most drawn numbers</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="how-it-works" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Lottery Process</CardTitle>
                  <CardDescription>How our transparent lottery system works</CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram chart={lotteryFlowChart} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                  <CardDescription>What makes our lottery fair and transparent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Verifiable Randomness</h4>
                      <p className="text-sm text-muted-foreground">
                        Uses Chainlink VRF for provably fair random number generation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Automatic Distribution</h4>
                      <p className="text-sm text-muted-foreground">
                        Winners receive prizes automatically via smart contracts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Transparent Operations</h4>
                      <p className="text-sm text-muted-foreground">
                        All draws and results are publicly verifiable on-chain
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Growing Jackpots</h4>
                      <p className="text-sm text-muted-foreground">
                        Unclaimed prizes roll over to increase future jackpots
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Prize Distribution</CardTitle>
                <CardDescription>How ticket sales are allocated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">70%</div>
                    <div className="font-medium">Prize Pool</div>
                    <div className="text-sm text-muted-foreground">Goes directly to winners</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">20%</div>
                    <div className="font-medium">Future Jackpots</div>
                    <div className="text-sm text-muted-foreground">Builds bigger prizes</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">10%</div>
                    <div className="font-medium">Platform Fee</div>
                    <div className="text-sm text-muted-foreground">Covers operations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Tickets Purchased</span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Spent</span>
                      <span className="font-medium">$235</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Wins</span>
                      <span className="font-medium text-green-600">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Won</span>
                      <span className="font-medium text-green-600">$150</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">6.4%</div>
                    <div className="text-sm text-muted-foreground">3 wins out of 47 tickets</div>
                    <Progress value={6.4} className="mt-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Net Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">-$85</div>
                    <div className="text-sm text-muted-foreground">Total spent vs. winnings</div>
                    <div className="text-xs text-muted-foreground mt-2">Keep playing for bigger wins!</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Ticket History</CardTitle>
                <CardDescription>Recent lottery participation and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Daily Quick Draw #156</div>
                        <div className="text-sm text-muted-foreground">2 tickets • 1 day ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">Won $50</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">Weekly Jackpot #46</div>
                        <div className="text-sm text-muted-foreground">5 tickets • 1 week ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">No win</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Daily Quick Draw #148</div>
                        <div className="text-sm text-muted-foreground">1 ticket • 2 weeks ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">Won $100</Badge>
                    </div>
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
