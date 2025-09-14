import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Shield, Vote } from "lucide-react"
import { SiteNavigation } from "@/components/site-navigation"

export default function ZKVerificationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
                Coming Soon
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                ZK-Verified Camera System
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Trustless inventory verification using Roc cameras with zero-knowledge proofs for transparent,
                privacy-preserving machine monitoring.
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
                    <Camera className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-center">Roc Camera Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Hardware-verified images from Roc cameras mounted inside each machine provide cryptographic proof of
                    contents and condition.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Shield className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-center">Zero-Knowledge Proofs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Verify inventory accuracy without revealing sensitive location or operational data through ZK
                    circuits.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Vote className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-center">Community Slashing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Token holders vote on verified images to slash dishonest stockers and maintain network integrity.
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How ZK Verification Works</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Capture & Attest</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Anyone can trigger the internal Roc camera to take cryptographically signed photos, especially
                        during mishaps
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Generate Proof</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ZK circuit creates proof of inventory state without revealing raw image data
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold">Community Review</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Verified images presented to token holders for accuracy voting
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold">Automated Enforcement</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Smart contracts execute slashing decisions based on community consensus
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center dark:bg-gray-900">
                  <h3 className="text-xl font-bold mb-4">Privacy-First Verification</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Maintain transparency while protecting sensitive operational data through advanced cryptography.
                  </p>
                  <Button disabled>ZK System Coming Soon</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Community-Initiated Verification</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Any community member can request verification photos when they suspect issues or encounter machine
                  problems.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-3xl items-start gap-8 sm:grid-cols-2 md:gap-12 mt-12">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Mishap Response</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  When a machine malfunctions or dispenses incorrectly, users can immediately trigger a verification
                  photo to document the issue.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Open Access</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No special permissions needed - any token holder can initiate the camera system for transparency and
                  accountability.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Technical Benefits</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Combining hardware attestation with zero-knowledge cryptography creates unprecedented trust in
                  decentralized systems.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-3xl items-start gap-8 sm:grid-cols-2 md:gap-12 mt-12">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Trustless Operation</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No need to trust individual operators when cryptographic proofs guarantee honest reporting.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Privacy Preservation</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Verify compliance without exposing sensitive location or business intelligence data.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Automated Governance</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Smart contracts automatically enforce community decisions without human intervention.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Scalable Verification</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  ZK proofs enable efficient verification across thousands of machines simultaneously.
                </p>
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
