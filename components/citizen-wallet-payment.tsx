"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Wallet } from "lucide-react"
import { createPaymentLink } from "@/lib/citizen-wallet/utils"
import { BREAD_TOKEN } from "@/lib/citizen-wallet/config"
import { toast } from "sonner"

interface CitizenWalletPaymentProps {
  amount: number
  productName: string
  onSuccess?: () => void
  className?: string
}

export function CitizenWalletPayment({ amount, productName, onSuccess, className = "" }: CitizenWalletPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    try {
      setIsProcessing(true)

      const description = `Purchase: ${productName}`
      const paymentLink = createPaymentLink(amount.toString(), description)

      // Open the Citizen Wallet payment link
      window.open(paymentLink, "_blank")

      toast.success("Payment link opened in new tab")

      // Simulate success after a delay (in real implementation, you'd listen for the success callback)
      setTimeout(() => {
        onSuccess?.()
        setIsProcessing(false)
      }, 2000)
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Failed to create payment link")
      setIsProcessing(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={isProcessing} className={className} variant="outline">
      <Wallet className="h-4 w-4 mr-2" />
      {isProcessing ? "Opening..." : `Pay with ${BREAD_TOKEN.symbol}`}
      <Badge variant="secondary" className="ml-2">
        {amount} {BREAD_TOKEN.symbol}
      </Badge>
      <ExternalLink className="h-3 w-3 ml-1" />
    </Button>
  )
}
