"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SiteNavigation } from "@/components/site-navigation"
import { Wallet, Send, ExternalLink, Copy, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

// For now, let's create a basic version without the SDK to test the routing
export default function CitizenWalletPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    toAddress: "",
    amount: "",
    description: "",
  })
  const [generatedLink, setGeneratedLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  // Get sigAuthRedirect from query parameters
  const sigAuthRedirect = searchParams.get("sigAuthRedirect") || ""

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generatePaymentLink = async () => {
    if (!formData.toAddress || !formData.amount) {
      toast.error("Please fill in recipient address and amount")
      return
    }

    try {
      setIsGenerating(true)

      // For now, just generate a mock link to test the UI
      const mockLink = `https://citizenwallet.xyz/pay?to=${formData.toAddress}&amount=${formData.amount}&description=${encodeURIComponent(formData.description)}`

      setGeneratedLink(mockLink)
      toast.success("Payment link generated successfully!")
    } catch (error) {
      console.error("Error generating payment link:", error)
      toast.error("Failed to generate payment link. Please check your inputs.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const openInCitizenWallet = () => {
    window.open(generatedLink, "_blank")
  }

  // Check for success parameter
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Payment completed successfully!")
    }
  }, [searchParams])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1 container px-4 md:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter flex items-center justify-center gap-2 mb-4">
            <Wallet className="h-8 w-8" />
            Citizen Wallet Integration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Generate payment links for BREAD token transactions using Citizen Wallet. Create secure, gasless payments
            for the Breadchain Community Token on Gnosis Chain.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center gap-4 mb-8">
          <Badge variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Gnosis Chain (100)
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            BREAD Token
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Gasless Payments
          </Badge>
        </div>

        {/* Missing sigAuthRedirect Warning */}
        {!sigAuthRedirect && (
          <Alert className="mb-8 border-yellow-200 dark:border-yellow-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              <strong>Note:</strong> The sigAuthRedirect parameter is missing. This parameter should be provided by the
              Citizen Wallet app when redirecting to this page. Without it, generated links may not work properly.
            </AlertDescription>
          </Alert>
        )}

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Payment Link Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Generate Payment Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="toAddress">Recipient Address</Label>
                  <Input
                    id="toAddress"
                    placeholder="0x..."
                    value={formData.toAddress}
                    onChange={(e) => handleInputChange("toAddress", e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    The Ethereum address that will receive the BREAD tokens
                  </p>
                </div>

                <div>
                  <Label htmlFor="amount">Amount (BREAD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.000000000000000001"
                    placeholder="10.5"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Amount in BREAD tokens (supports up to 18 decimal places)
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Payment for..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional description for the payment</p>
                </div>
              </div>

              <Button
                onClick={generatePaymentLink}
                disabled={isGenerating || !formData.toAddress || !formData.amount}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Payment Link"}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Link Display */}
          {generatedLink && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-5 w-5" />
                  Payment Link Generated
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Generated Link</Label>
                  <div className="flex gap-2">
                    <Input value={generatedLink} readOnly className="font-mono text-xs" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex-shrink-0 bg-transparent"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={openInCitizenWallet} className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Citizen Wallet
                  </Button>
                  <Button variant="outline" onClick={copyToClipboard} className="flex-1 bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>

                <Alert className="border-blue-200 dark:border-blue-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    Share this link with the payer. They can open it in their Citizen Wallet app to complete the gasless
                    BREAD token payment.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Information Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About BREAD Token</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Name:</strong> Breadchain Community Token
                </p>
                <p>
                  <strong>Symbol:</strong> BREAD
                </p>
                <p>
                  <strong>Network:</strong> Gnosis Chain (Chain ID: 100)
                </p>
                <p>
                  <strong>Contract:</strong> <code className="text-xs">0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3</code>
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-3">
                  BREAD is a digital community token developed by Breadchain Cooperative that generates yield for
                  post-capitalist organizations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Citizen Wallet Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Gasless transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Account abstraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Social recovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Mobile-first design</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-3">
                  Citizen Wallet provides a user-friendly way to interact with BREAD tokens without gas fees.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Integration Info */}
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg">Integration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">How it works:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>User opens Citizen Wallet app and navigates to this integration</li>
                  <li>App provides sigAuthRedirect parameter when redirecting here</li>
                  <li>You fill in recipient address, amount, and optional description</li>
                  <li>System generates a secure payment link using Citizen Wallet SDK</li>
                  <li>Payer opens the link in their Citizen Wallet app</li>
                  <li>Payment is processed gaslessly on Gnosis Chain</li>
                  <li>Success callback redirects back to this page</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">Technical Details:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Uses Citizen Wallet SDK for link generation</li>
                  <li>Supports gasless transactions via account abstraction</li>
                  <li>Integrates with Breadchain Community Token ecosystem</li>
                  <li>Built on Gnosis Chain for low-cost operations</li>
                </ul>
              </div>

              <Alert className="border-orange-200 dark:border-orange-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-orange-700 dark:text-orange-300">
                  <strong>Development Note:</strong> This is currently showing a mock implementation. The full Citizen
                  Wallet SDK integration will be activated once the package is properly installed.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Mutual Vend. All rights reserved.</p>
      </footer>
    </div>
  )
}
