import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Bot, ShoppingCart, Coins, Clock, Wallet } from "lucide-react"
import Link from "next/link"
import MermaidDiagram from "@/components/mermaid-diagram"

const revShareFlowchart = `graph LR
    A[Buy Snack] --> B[Get Token]
    B --> C[Hold 2 Weeks]
    C --> D[Others Buy]
    D --> E[Earn Revenue]
    E --> C
    C --> F[Token Expires]`

export default function RevenueSharePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Bot className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Mutual Vend</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/#how-it-works"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            How It Works
          </Link>
          <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link
            href="/#blueprints"
            className="text-sm font--medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Blueprints
          </Link>
          <Link href="/#faq" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            FAQ
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Earn While You Snack</h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Every purchase you make isn't just a transaction—it's an investment. Get a temporary stake in the
                machine's profits and become part of the ecosystem.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  The Cycle of Value
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How You Earn</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16 mt-12">
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">1. Make a Purchase</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Buy any item from a Mutual Vend machine using your preferred crypto.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Coins className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">2. Receive a Share</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You automatically receive a token representing your temporary revenue share.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">3. Earn Profits</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  For a set time (e.g., 2 weeks), you earn a percentage of all sales from that machine.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Wallet className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">4. Get Paid</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your earnings are automatically streamed to your wallet in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Visualizing the Flow</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The process is simple. Your purchase kicks off a period where you become a stakeholder, earning from the
                machine's activity.
              </p>
            </div>
            <div className="flex w-full items-center justify-center">
              <div className="w-full rounded-lg border bg-card p-6 dark:bg-gray-900">
                <MermaidDiagram chart={revShareFlowchart} />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Revenue Share FAQ</h2>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-3xl">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>How is the revenue share percentage calculated?</AccordionTrigger>
                  <AccordionContent>
                    The percentage is determined by the protocol and can be adjusted through community governance. It's
                    designed to be a meaningful reward for participating while ensuring the system remains sustainable.
                    The exact percentage may vary based on the machine's location and sales volume.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How long does my share last?</AccordionTrigger>
                  <AccordionContent>
                    The standard duration for a revenue share is 2 weeks from the time of your purchase. This can also
                    be adjusted by community vote in the future.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I have multiple shares at once?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Each purchase you make grants you a new, separate revenue share. You can hold shares from
                    multiple machines or multiple shares from the same machine. Each share's 2-week timer runs
                    independently.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>What happens if no one buys anything after me?</AccordionTrigger>
                  <AccordionContent>
                    Your revenue share is based on subsequent sales. If there are no sales during your 2-week window,
                    you won't earn any additional revenue from that specific share. The model encourages participation
                    in high-traffic locations.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
