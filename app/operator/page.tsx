"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SiteNavigation } from "@/components/site-navigation"
import { WalletConnect } from "@/components/wallet-connect"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { useRoles } from "@/hooks/use-roles"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/addresses"
import { Settings, Package, DollarSign, CreditCard, Shield, AlertCircle, Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { formatUnits } from "viem"

interface ProductForm {
  name: string
  imageURI: string
}

export default function OperatorPage() {
  const { isConnected, address } = useAccount()
  const { hasOperatorRole, isLoading: rolesLoading } = useRoles()
  const { tracks, acceptedTokens, refetchTracks, loading } = useVendingMachine()
  
  const [editingTrack, setEditingTrack] = useState<number | null>(null)
  const [productForm, setProductForm] = useState<ProductForm>({ name: "", imageURI: "" })
  const [stockAmount, setStockAmount] = useState("")
  const [priceAmount, setPriceAmount] = useState("")
  const [newTokenAddress, setNewTokenAddress] = useState("")
  
  const { writeContract, data: hash, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const handleLoadTrack = async (trackId: number) => {
    if (!productForm.name.trim()) {
      toast.error("Product name is required")
      return
    }
    
    if (!stockAmount || Number(stockAmount) <= 0) {
      toast.error("Stock amount must be greater than 0")
      return
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESSES.VENDING_MACHINE,
        abi: VENDING_MACHINE_ABI,
        functionName: "loadTrack",
        args: [
          trackId,
          {
            name: productForm.name,
            imageURI: productForm.imageURI || "",
          },
          BigInt(stockAmount),
        ],
      })
      
      toast.success("Loading track...")
      setEditingTrack(null)
      setProductForm({ name: "", imageURI: "" })
      setStockAmount("")
    } catch (err) {
      console.error("Failed to load track:", err)
      toast.error("Failed to load track")
    }
  }

  const handleRestockTrack = async (trackId: number) => {
    if (!stockAmount || Number(stockAmount) <= 0) {
      toast.error("Stock amount must be greater than 0")
      return
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESSES.VENDING_MACHINE,
        abi: VENDING_MACHINE_ABI,
        functionName: "restockTrack",
        args: [trackId, BigInt(stockAmount)],
      })
      
      toast.success("Restocking track...")
      setEditingTrack(null)
      setStockAmount("")
    } catch (err) {
      console.error("Failed to restock track:", err)
      toast.error("Failed to restock track")
    }
  }

  const handleSetPrice = async (trackId: number) => {
    if (!priceAmount || Number(priceAmount) <= 0) {
      toast.error("Price must be greater than 0")
      return
    }

    try {
      // Convert price to 6 decimals (assuming USDC-like tokens)
      const priceInTokens = BigInt(Math.floor(Number(priceAmount) * 1e6))
      
      writeContract({
        address: CONTRACT_ADDRESSES.VENDING_MACHINE,
        abi: VENDING_MACHINE_ABI,
        functionName: "setTrackPrice",
        args: [trackId, priceInTokens],
      })
      
      toast.success("Setting track price...")
      setEditingTrack(null)
      setPriceAmount("")
    } catch (err) {
      console.error("Failed to set track price:", err)
      toast.error("Failed to set track price")
    }
  }

  const handleConfigureTokens = async () => {
    if (!newTokenAddress.trim()) {
      toast.error("Token address is required")
      return
    }

    try {
      // Add new token to existing tokens
      const tokenAddresses = [...acceptedTokens.map(t => t.address), newTokenAddress as `0x${string}`]
      
      writeContract({
        address: CONTRACT_ADDRESSES.VENDING_MACHINE,
        abi: VENDING_MACHINE_ABI,
        functionName: "configurePaymentTokens",
        args: [tokenAddresses],
      })
      
      toast.success("Configuring payment tokens...")
      setNewTokenAddress("")
    } catch (err) {
      console.error("Failed to configure tokens:", err)
      toast.error("Failed to configure tokens")
    }
  }

  // Refresh data after successful transactions
  if (isConfirmed) {
    setTimeout(() => {
      refetchTracks()
    }, 2000)
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Operator Access Required</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to access the operator dashboard.</p>
            <WalletConnect />
          </div>
        </main>
      </div>
    )
  }

  if (rolesLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Checking operator permissions...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!hasOperatorRole) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Access Denied</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">You need operator role to access this page.</p>
            <p className="text-xs text-gray-400">Connected: {address}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />
      
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Operator Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage vending machine inventory, pricing, and payment tokens
          </p>
        </div>

        {error && (
          <Alert className="mb-8 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Track Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Track Management
              </CardTitle>
              <CardDescription>Load products, manage stock, and set prices for each track</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tracks.map((track) => (
                  <div key={track.trackId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">Track {track.trackId}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {track.product.name || "No product loaded"}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">Stock: {track.stock.toString()}</Badge>
                          <Badge variant="outline">
                            Price: ${track.price > 0n ? formatUnits(track.price, 6) : "0.00"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTrack(track.trackId)}
                        disabled={editingTrack === track.trackId}
                      >
                        {editingTrack === track.trackId ? "Editing..." : "Edit"}
                      </Button>
                    </div>

                    {editingTrack === track.trackId && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="productName">Product Name</Label>
                            <Input
                              id="productName"
                              value={productForm.name}
                              onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                              placeholder="Enter product name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="imageURI">Image URI (optional)</Label>
                            <Input
                              id="imageURI"
                              value={productForm.imageURI}
                              onChange={(e) => setProductForm({...productForm, imageURI: e.target.value})}
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="stock">Stock Amount</Label>
                            <Input
                              id="stock"
                              type="number"
                              min="0"
                              value={stockAmount}
                              onChange={(e) => setStockAmount(e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="price">Price (USD)</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              min="0"
                              value={priceAmount}
                              onChange={(e) => setPriceAmount(e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <Button
                              onClick={() => handleLoadTrack(track.trackId)}
                              disabled={isConfirming}
                              size="sm"
                            >
                              Load Track
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleRestockTrack(track.trackId)}
                              disabled={isConfirming || !stockAmount}
                              size="sm"
                            >
                              Restock
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleSetPrice(track.trackId)}
                              disabled={isConfirming || !priceAmount}
                              size="sm"
                            >
                              Set Price
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Token Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Tokens
              </CardTitle>
              <CardDescription>Configure which tokens are accepted for payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Current Accepted Tokens</h4>
                  <div className="flex flex-wrap gap-2">
                    {acceptedTokens.map((token) => (
                      <Badge key={token.address} variant="secondary">
                        {token.symbol} - {token.address.slice(0, 6)}...{token.address.slice(-4)}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newTokenAddress}
                    onChange={(e) => setNewTokenAddress(e.target.value)}
                    placeholder="0x... Token address to add"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleConfigureTokens}
                    disabled={isConfirming || !newTokenAddress.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Token
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}