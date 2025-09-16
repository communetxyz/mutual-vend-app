"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import type { Track } from "@/lib/types/vending-machine"
import { usePurchase } from "@/hooks/use-purchase"
import { useAccount } from "wagmi"
import { formatUnits } from "viem"

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  track: Track | null
  acceptedTokens: `0x${string}`[]
  contractAddress: `0x${string}`
}

export function PurchaseModal({ isOpen, onClose, track, acceptedTokens, contractAddress }: PurchaseModalProps) {
  const [selectedToken, setSelectedToken] = useState<string>("")
  const { address } = useAccount()
  const { executePurchase, currentStep, error, reset } = usePurchase()

  const handlePurchase = async () => {
    if (!track || !selectedToken || !address) return

    await executePurchase({
      contractAddress,
      trackId: track.trackId,
      tokenAddress: selectedToken as `0x${string}`,
      price: formatUnits(track.price, 18),
      userAddress: address,
    })
  }

  const handleClose = () => {
    reset()
    setSelectedToken("")
    onClose()
  }

  if (!track) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase {track.product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={track.product.imageURI || "/placeholder.svg?height=80&width=80"}
              alt={track.product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold">{track.product.name}</h3>
              <p className="text-sm text-muted-foreground">Price: {formatUnits(track.price, 18)} tokens</p>
              <Badge variant={track.stock > 0 ? "default" : "destructive"}>
                {track.stock > 0 ? `${track.stock} in stock` : "Out of stock"}
              </Badge>
            </div>
          </div>

          {track.stock > 0 && (
            <>
              <div>
                <label className="text-sm font-medium">Payment Token</label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment token" />
                  </SelectTrigger>
                  <SelectContent>
                    {acceptedTokens.map((token) => (
                      <SelectItem key={token} value={token}>
                        {token.slice(0, 6)}...{token.slice(-4)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {currentStep === "success" && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Purchase successful!</span>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={handlePurchase}
                  disabled={!selectedToken || currentStep === "approving" || currentStep === "purchasing"}
                  className="flex-1"
                >
                  {currentStep === "approving" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {currentStep === "purchasing" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {currentStep === "approving" && "Approving..."}
                  {currentStep === "purchasing" && "Purchasing..."}
                  {currentStep === "idle" && "Purchase"}
                  {currentStep === "success" && "Purchase Complete"}
                  {currentStep === "error" && "Try Again"}
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
