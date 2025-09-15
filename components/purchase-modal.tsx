"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePurchase } from "@/hooks/use-purchase"
import { useAccount, useBalance } from "wagmi"
import { formatUnits } from "viem"
import { ShoppingCart, Wallet, CheckCircle, AlertCircle, Loader2, ExternalLink, CreditCard } from "lucide-react"

interface Product {
  id: number
  name: string
  price: string
  image: string
  stock: number
  trackId: number
}

interface Token {
  address: string
  symbol: string
  decimals: number
}

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  selectedToken: Token | null
}

export function PurchaseModal({ isOpen, onClose, product, selectedToken }: PurchaseModalProps) {
  const { address } = useAccount()
  const [step, setStep] = useState<"approve" | "purchase" | "success">("approve")

  const {
    // Approval
    approveToken,
    isApproving,
    approvalSuccess,
    approvalHash,

    // Purchase
    purchaseProduct,
    isPurchasing,
    purchaseSuccess,
    purchaseHash,

    // Shared
    error,
    setError,
  } = usePurchase()

  // Get user's token balance
  const { data: balance } = useBalance({
    address,
    token: selectedToken?.address as `0x${string}`,
  })

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("approve")
      setError(null)
    }
  }, [isOpen, setError])

  // Handle approval success
  useEffect(() => {
    if (approvalSuccess && step === "approve") {
      setStep("purchase")
    }
  }, [approvalSuccess, step])

  // Handle purchase success
  useEffect(() => {
    if (purchaseSuccess && step === "purchase") {
      setStep("success")
    }
  }, [purchaseSuccess, step])

  if (!product || !selectedToken) return null

  const handleApprove = () => {
    approveToken(selectedToken.address, product.price, selectedToken.decimals)
  }

  const handlePurchase = () => {
    purchaseProduct(product.trackId, selectedToken.address)
  }

  const handleClose = () => {
    setStep("approve")
    setError(null)
    onClose()
  }

  const hasInsufficientBalance =
    balance && Number.parseFloat(formatUnits(balance.value, balance.decimals)) < Number.parseFloat(product.price)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track #{product.trackId}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold">
                  {product.price} {selectedToken.symbol}
                </span>
                <Badge variant="outline" className="text-xs">
                  {product.stock} in stock
                </Badge>
              </div>
            </div>
          </div>

          {/* Balance Check */}
          {balance && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Your balance:</span>
              <span className={hasInsufficientBalance ? "text-red-600" : "text-green-600"}>
                {Number.parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {selectedToken.symbol}
              </span>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Insufficient Balance Warning */}
          {hasInsufficientBalance && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Insufficient balance. You need {product.price} {selectedToken.symbol} to make this purchase.
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center gap-2 ${step === "approve" ? "text-blue-600" : step === "purchase" || step === "success" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "approve" ? "bg-blue-100 text-blue-600" : step === "purchase" || step === "success" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
              >
                {step === "purchase" || step === "success" ? <CheckCircle className="h-4 w-4" /> : "1"}
              </div>
              <span className="text-sm font-medium">Approve</span>
            </div>

            <div
              className={`w-8 h-1 rounded ${step === "purchase" || step === "success" ? "bg-green-200" : "bg-gray-200"}`}
            />

            <div
              className={`flex items-center gap-2 ${step === "purchase" ? "text-blue-600" : step === "success" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "purchase" ? "bg-blue-100 text-blue-600" : step === "success" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
              >
                {step === "success" ? <CheckCircle className="h-4 w-4" /> : "2"}
              </div>
              <span className="text-sm font-medium">Purchase</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {step === "approve" && (
              <Button
                onClick={handleApprove}
                disabled={isApproving || hasInsufficientBalance || !address}
                className="w-full"
                size="lg"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Approve {selectedToken.symbol}
                  </>
                )}
              </Button>
            )}

            {step === "purchase" && (
              <Button onClick={handlePurchase} disabled={isPurchasing} className="w-full" size="lg">
                {isPurchasing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Purchasing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Purchase Product
                  </>
                )}
              </Button>
            )}

            {step === "success" && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-8 w-8" />
                  <span className="text-lg font-semibold">Purchase Successful!</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your product will be dispensed shortly. Thank you for your purchase!
                </p>
                <Button onClick={handleClose} className="w-full">
                  Close
                </Button>
              </div>
            )}
          </div>

          {/* Transaction Links */}
          {(approvalHash || purchaseHash) && (
            <div className="space-y-2 text-sm">
              {approvalHash && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Approval:</span>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${approvalHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    View on Etherscan
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {purchaseHash && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Purchase:</span>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${purchaseHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    View on Etherscan
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
