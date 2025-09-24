"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatEther } from "viem"
import { usePurchase } from "@/hooks/use-purchase"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import type { Track } from "@/lib/types/vending-machine"

interface PurchaseModalProps {
  track: Track
  isOpen: boolean
  onClose: () => void
}

// Mock token for demo purposes
const MOCK_TOKEN_ADDRESS = "0x1234567890123456789012345678901234567890"

export function PurchaseModal({ track, isOpen, onClose }: PurchaseModalProps) {
  const { isLoading, error, success, approveToken, executePurchase, resetPurchaseState } = usePurchase()
  const [step, setStep] = useState<"approve" | "purchase" | "complete">("approve")

  useEffect(() => {
    if (isOpen) {
      setStep("approve")
      resetPurchaseState()
    }
  }, [isOpen, resetPurchaseState])

  useEffect(() => {
    if (success && step === "approve") {
      setStep("purchase")
      resetPurchaseState()
    } else if (success && step === "purchase") {
      setStep("complete")
    }
  }, [success, step, resetPurchaseState])

  const handleApprove = async () => {
    const approved = await approveToken(MOCK_TOKEN_ADDRESS, track.price)
    if (approved) {
      setTimeout(() => setStep("purchase"), 1000)
    }
  }

  const handlePurchase = async () => {
    await executePurchase(track.trackId, MOCK_TOKEN_ADDRESS)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep("approve")
      resetPurchaseState()
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase {track.product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={track.product.imageURI || "/placeholder.svg"}
              alt={track.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{track.product.name}</h3>
              <p className="text-2xl font-bold text-green-600">{formatEther(track.price)} ETH</p>
              <Badge variant="outline">Stock: {track.stock.toString()}</Badge>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-2 ${step === "approve" ? "text-blue-600" : step === "purchase" || step === "complete" ? "text-green-600" : "text-gray-400"}`}
            >
              {step === "approve" && isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === "purchase" || step === "complete" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-current" />
              )}
              <span className="text-sm font-medium">Approve Token</span>
            </div>

            <div
              className={`flex items-center space-x-2 ${step === "purchase" ? "text-blue-600" : step === "complete" ? "text-green-600" : "text-gray-400"}`}
            >
              {step === "purchase" && isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === "complete" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-current" />
              )}
              <span className="text-sm font-medium">Purchase Item</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {step === "complete" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Purchase successful! Your {track.product.name} will be dispensed shortly.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {step === "approve" && (
              <Button onClick={handleApprove} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  "Approve Token"
                )}
              </Button>
            )}

            {step === "purchase" && (
              <Button onClick={handlePurchase} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Purchasing...
                  </>
                ) : (
                  "Confirm Purchase"
                )}
              </Button>
            )}

            {step === "complete" && (
              <Button onClick={handleClose} className="flex-1">
                Close
              </Button>
            )}

            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
