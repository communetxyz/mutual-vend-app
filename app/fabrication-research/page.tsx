import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Microscope, Wrench, Users } from "lucide-react"
import { SiteNavigation } from "@/components/site-navigation"

export default function FabricationResearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Coming Soon
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Open Source Fabrication Research
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Advancing the science of decentralized manufacturing through collaborative research and open innovation.
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
                    <Microscope className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-center">Material Science</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Research into optimal 3D printing materials for durability, food safety, and cost-effectiveness in
                    vending machine applications.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Wrench className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-center">Design Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Collaborative engineering to improve machine reliability, reduce print time, and minimize assembly
                    complexity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-center">Community Labs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Distributed research network where makers worldwide contribute testing data and design improvements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What We're Building</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                A comprehensive research platform that democratizes manufacturing knowledge and accelerates innovation
                in decentralized fabrication.
              </p>
              <div className="flex justify-center mt-8">
                <Button size="lg" disabled>
                  Research Portal Coming Soon
                </Button>
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
