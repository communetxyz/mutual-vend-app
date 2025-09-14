import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, TrendingUp, Shuffle } from "lucide-react"
import { SiteNavigation } from "@/components/site-navigation"

export default function LiquidOwnershipPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Coming Soon
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Liquid Ownership Model
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Democratize vending machine ownership through fractionalized, tradeable shares that make manufacturing
                accessible to everyone.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3 md:gap-12">
              <Card>
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Droplets className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-center">Fractionalized Ownership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Own a piece of a vending machine without the full upfront cost. Buy and sell ownership shares on a
                    liquid marketplace.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-center">Dynamic Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Share prices fluctuate based on machine performance, location desirability, and market demand.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Shuffle className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-center">Instant Liquidity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Exit your investment anytime by selling shares to other community members through automated market
                    makers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Pool Resources</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Community members contribute funds to a machine manufacturing pool
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Mint Ownership Tokens</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive tradeable tokens representing your share of the machine
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold">Earn & Trade</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Collect revenue proportional to your ownership and trade shares freely
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center dark:bg-gray-900">
                  <h3 className="text-xl font-bold mb-4">Coming Soon</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    The liquid ownership marketplace will launch with our first community-funded machines.
                  </p>
                  <Button disabled>Join Beta Waitlist</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Mutual Vend. All rights reserved.</p>
      </footer>
    </div>
  )
}
