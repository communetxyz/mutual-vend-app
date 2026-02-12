"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SiteNavigation } from "@/components/site-navigation"
import { WalletConnect } from "@/components/wallet-connect"
import { useVoteToken } from "@/hooks/use-vote-token"
import { Shield, CheckCircle, XCircle, AlertCircle, Lock, Eye, Users } from "lucide-react"
import { toast } from "sonner"
import { formatUnits } from "viem"

// Mock verification data - in production this would come from ZK proof verification
interface VerificationStatus {
  address: string
  isVerified: boolean
  verificationLevel: "none" | "basic" | "premium" | "elite"
  lastVerified: Date | null
  proofHash?: string
}

const VERIFICATION_LEVELS = {
  none: { name: "Unverified", color: "text-gray-500", bgColor: "bg-gray-100 dark:bg-gray-800" },
  basic: { name: "Basic", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900" },
  premium: { name: "Premium", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900" },
  elite: { name: "Elite", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900" },
}

export default function ZKVerificationPage() {
  const { isConnected, address } = useAccount()
  const { balance } = useVoteToken()
  
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  
  // Mock verification status - in production, fetch from ZK verification contract
  const [verificationStatus] = useState<VerificationStatus>({
    address: address || "",
    isVerified: false,
    verificationLevel: "none",
    lastVerified: null,
  })

  const formatVoteTokens = (amount: bigint) => {
    return parseFloat(formatUnits(amount, 18)).toFixed(2)
  }

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter a verification code")
      return
    }

    setIsVerifying(true)
    
    // Mock verification process
    setTimeout(() => {
      setIsVerifying(false)
      toast.success("Verification submitted! Processing may take a few minutes.")
      setVerificationCode("")
    }, 2000)
  }

  const getVerificationBenefits = (level: string) => {
    const benefits = {
      none: [],
      basic: ["Purchase verification", "Basic reputation score"],
      premium: ["Enhanced transaction limits", "Priority customer support", "Governance weight bonus"],
      elite: ["Maximum transaction limits", "VIP benefits", "Enhanced voting power", "Revenue sharing tier"]
    }
    return benefits[level as keyof typeof benefits] || []
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <SiteNavigation />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Connect to Verify Identity</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to check your verification status.</p>
            <WalletConnect />
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
            <Shield className="h-8 w-8" />
            Zero-Knowledge Verification
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Verify your identity while maintaining privacy through zero-knowledge proofs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {verificationStatus.isVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Your Verification Status
              </CardTitle>
              <CardDescription>Privacy-preserving identity verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Verification Level</span>
                <Badge 
                  className={`${VERIFICATION_LEVELS[verificationStatus.verificationLevel].bgColor} ${VERIFICATION_LEVELS[verificationStatus.verificationLevel].color}`}
                >
                  {VERIFICATION_LEVELS[verificationStatus.verificationLevel].name}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Address</span>
                <span className="text-sm font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">VoteTokens</span>
                <span className="text-sm">{formatVoteTokens(balance)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Last Verified</span>
                <span className="text-sm">
                  {verificationStatus.lastVerified ? 
                    verificationStatus.lastVerified.toLocaleDateString() : 
                    "Never"
                  }
                </span>
              </div>

              {!verificationStatus.isVerified && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You are not verified. Complete verification to unlock additional features and benefits.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Verification Process */}
          <Card>
            <CardHeader>
              <CardTitle>Start Verification</CardTitle>
              <CardDescription>Submit verification code to prove identity without revealing personal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter your verification code"
                  disabled={isVerifying}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Obtain verification codes through approved identity providers
                </p>
              </div>
              
              <Button 
                onClick={handleVerification}
                disabled={isVerifying || !verificationCode.trim()}
                className="w-full"
              >
                {isVerifying ? "Verifying..." : "Submit Verification"}
              </Button>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4" />
                  Your personal data never leaves your device
                </p>
                <p className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Only proof of verification is stored on-chain
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Verification Benefits */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Verification Benefits</CardTitle>
              <CardDescription>Unlock features and benefits based on your verification level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(VERIFICATION_LEVELS).map(([level, config]) => (
                  <Card key={level} className={`${config.bgColor} border-2 ${verificationStatus.verificationLevel === level ? 'border-primary' : 'border-transparent'}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-sm ${config.color}`}>
                        {config.name} Level
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {getVerificationBenefits(level).map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                        {getVerificationBenefits(level).length === 0 && (
                          <div className="text-xs text-gray-500">No additional benefits</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How ZK Verification Works */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>How Zero-Knowledge Verification Works</CardTitle>
              <CardDescription>Understanding privacy-preserving identity verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Generate Proof</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your device generates a cryptographic proof of your identity without revealing personal information
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Submit to Chain</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      The proof is verified and recorded on the blockchain as a verification credential
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Unlock Benefits</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Access enhanced features while maintaining complete privacy of your personal data
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Future Features */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Coming Soon: Community Features
              </CardTitle>
              <CardDescription>Additional features planned for verified users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Enhanced Governance</h4>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• Verified user voting weight multipliers</li>
                    <li>• Access to premium governance proposals</li>
                    <li>• Community reputation scoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Premium Services</h4>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• Priority customer support</li>
                    <li>• Early access to new features</li>
                    <li>• Enhanced revenue sharing tiers</li>
                  </ul>
                </div>
              </div>
              <Badge variant="outline" className="mt-4">
                🚧 In Development
              </Badge>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}