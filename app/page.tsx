import { cn } from "@/lib/utils"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Printer, PackageCheck, Diamond, PieChart, Users, Download } from "lucide-react"
import Link from "next/link"
import MermaidDiagram from "@/components/mermaid-diagram"
import { SiteNavigation } from "@/components/site-navigation"

const stockingFlowchart = `graph TD
    A["Stocker wants to add inventory"] --> B{Posts Collateral};
    B --> C["Adds products to machine"];
    C --> D{Community Verification via Voting};
    D -- "Vote: Correct" --> E["Collateral Unlocked + Reward"];
    D -- "Vote: Incorrect" --> F["Collateral Slashed"];
    E --> G["Machine is ready for sales"];`

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

export default function MutualVendPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Own a Piece of the Vending Machine You Use
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Mutual Vend is a decentralized, 3D-printable vending machine network where every purchase earns you
                    a share of the profits.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">Join the Waitlist</Button>
                  <Button variant="outline" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download Blueprints
                  </Button>
                </div>
              </div>
              <img
                src="/vending-machine-prototype-2.png"
                width="550"
                height="550"
                alt="Mutual Vend Machine Prototype"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>

        <section id="blueprints" className="w-full py-12 md:py-24 lg:py-32 border-t bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Inspiration & Blueprints</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Get inspired by what others have built. These open-source projects can be a great starting point.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3 md:gap-12 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>Arduino Snack Machine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    A classic snack vending machine powered by an Arduino.
                  </p>
                  <Button asChild variant="outline">
                    <Link
                      href="https://www.instructables.com/Snack-Vending-Machine-Powered-by-Arduino/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Instructables
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Bitcoin Candy Machine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    An Arduino-based candy machine that accepts Bitcoin for payments.
                  </p>
                  <Button asChild variant="outline">
                    <Link
                      href="https://www.hackster.io/elkrem/arduino-based-bitcoin-candy-vending-machine-9f53d8"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Hackster.io
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Modular Coin-Operated Machine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    A 3D-printed vending machine that accepts physical fiat coins with modular slot configurations.
                    Features scalable designs for different product sizes and detailed assembly guides.
                  </p>
                  <Button asChild variant="outline">
                    <Link
                      href="https://makerworld.com/en/models/1520761-coin-operated-vending-machine?from=search#profileId-1678295"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on MakerWorld
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Simple, Powerful Cycle</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our ecosystem is designed for transparency and community participation at every step.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16 mt-12">
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Printer className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">1. Print & Assemble</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Download the open-source files and 3D print your own Mutual Vend machine.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <PackageCheck className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">2. Stock the Machine</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Community members post collateral to stock the machine. Others vote to verify the inventory.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Diamond className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">3. Pay with Crypto</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Customers purchase items easily and securely using their favorite cryptocurrency.
                </p>
              </div>
              <Link href="/revenue-share" className="grid gap-1 text-center" prefetch={false}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <PieChart className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">4. Earn Revshare</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Every purchase grants the customer a temporary share of the machine's revenue.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Trustless Stocking, Powered by the Community.
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our innovative collateral and voting system ensures machines are always stocked honestly and
                efficiently, without a central operator.
              </p>
            </div>
            <div className="flex w-full items-center justify-center">
              <div className="w-full rounded-lg border bg-card p-6 dark:bg-gray-900">
                <MermaidDiagram chart={stockingFlowchart} />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Core Features
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  The Future of Decentralized Commerce
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  Mutual Vend combines cutting-edge technologies to create a self-sustaining, community-owned retail
                  network.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Download className="h-6 w-6" />
                      </div>
                      <CardTitle>3D Printable & Open Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Accessible and customizable. Print your machine on your terms and modify it as you see fit.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Diamond className="h-6 w-6" />
                      </div>
                      <CardTitle>Crypto Integrated</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Seamless, secure, and low-fee payments on the blockchain. No banks required.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Users className="h-6 w-6" />
                      </div>
                      <CardTitle>Community Governed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Vote on new products, verify stock, and shape the future of the Mutual Vend network.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Have questions? We have answers.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-3xl">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is Mutual Vend?</AccordionTrigger>
                  <AccordionContent>
                    Mutual Vend is a decentralized network of 3D-printable vending machines. It's run by its community
                    of users, who stock the machines, verify inventory, and share in the revenue generated from sales.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How does the revenue share (revshare) work?</AccordionTrigger>
                  <AccordionContent>
                    When you buy an item, a portion of the payment is converted into a temporary revenue-sharing token.
                    This token entitles you to a percentage of all sales from that specific machine for a set period
                    (e.g., 2 weeks). Payouts are distributed automatically in crypto.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What cryptocurrencies can I use?</AccordionTrigger>
                  <AccordionContent>
                    The network primarily uses stablecoins like USDC and USDT for price stability and ease of use. The
                    network's native token is $BREAD, used for governance and rewards. The community can vote to add
                    support for additional stablecoins they choose.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I become a stocker or verifier?</AccordionTrigger>
                  <AccordionContent>
                    To become a stocker, you need to stake stablecoin collateral in a smart contract. This collateral
                    acts as a security deposit. Verifiers are randomly selected token holders who can vote on whether a
                    machine has been stocked correctly. Verifiers earn a small fee for participating.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Join the Vending Revolution</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Be the first to know when we launch. Sign up for our waitlist to get updates, early access, and a voice
                in our growing community.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
                <Button type="submit">Join Waitlist</Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sign up to get notified when we launch.
                <Link href="#" className="underline underline-offset-2" prefetch={false}>
                  Terms & Conditions
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Mutual Vend. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
