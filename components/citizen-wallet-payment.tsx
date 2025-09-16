"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, ExternalLink, Coins } from "lucide-react"
import { generateBreadReceiveLink, isCitizenWalletAvailable, getSigAuthRedirect } from "@/lib/citizen-wallet/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CitizenWalletPaymentProps {
  productName: string
  amount: string
  trackId: number
  onSuccess?: () => void
  disabled?: boolean
}

export function CitizenWalletPayment({
  productName,
  amount,
  trackId,
  onSuccess,
  disabled = false,
}: CitizenWalletPaymentProps) {
  const router = useRouter()
  const [isAvailable, setIsAvailable] = useState(false)
  const [sigAuthRedirect, setSigAuthRedirect] = useState<string | null>(null)

  useEffect(() => {
    setIsAvailable(isCitizenWalletAvailable())
    setSigAuthRedirect(getSigAuthRedirect())
  }, [])

  const handlePayWithBread = () => {
    try {
      // Use the vending machine address as the destination
      const toAccountAddress = process.env.NEXT_PUBLIC_VENDING_MACHINE_ADDRESS!
      const description = `Purchase: ${productName} (Track #${trackId})`
      const successRedirect = `${window.location.origin}/vending-machine?purchase=success&track=${trackId}`

      if (sigAuthRedirect) {
        const receiveLink = generateBreadReceiveLink(
          sigAuthRedirect,
          toAccountAddress,
          amount,
          description,
          successRedirect,
        )

        router.push(receiveLink)
      } else {
        // Fallback: open Citizen Wallet directly
        const citizenWalletUrl = `https://wallet.citizenwallet.xyz/bread/send?to=${toAccountAddress}&amount=${amount}&description=${encodeURIComponent(description)}`
        window.open(citizenWalletUrl, "_blank")
      }

      toast.success("Redirecting to Citizen Wallet...")
      onSuccess?.()
    } catch (error) {
      console.error("Error generating BREAD payment link:", error)
      toast.error("Failed to generate payment link")
    }
  }

  if (!isAvailable) {
    return (
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Coins className="h-4 w-4" />
            Pay with BREAD Token
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert>
            <Wallet className="h-4 w-4" />
            <AlertDescription>BREAD payments are available through the Citizen Wallet app.</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => window.open("https://wallet.citizenwallet.xyz/bread", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Citizen Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Coins className="h-4 w-4 text-green-600" />
          Pay with BREAD Token
          <Badge variant="secondary" className="ml-auto">
            Community Token
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
          <div className="flex items-center gap-2">
            <img
              src="https://assets.citizenwallet.xyz/wallet-config/_images/bread.svg"
              alt="BREAD Token"
              className="w-6 h-6"
            />
            <div>
              <div className="font-medium text-green-800 dark:text-green-200">BREAD</div>
              <div className="text-xs text-green-600 dark:text-green-400">Breadchain Community Token</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-800 dark:text-green-200">{amount}</div>
            <div className="text-xs text-green-600 dark:text-green-400">BREAD</div>
          </div>
        </div>

        <Button onClick={handlePayWithBread} disabled={disabled} className="w-full bg-green-600 hover:bg-green-700">
          <Wallet className="h-4 w-4 mr-2" />
          Pay with BREAD
        </Button>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Powered by Citizen Wallet • Community-owned payments
        </div>
      </CardContent>
    </Card>
  )
}
