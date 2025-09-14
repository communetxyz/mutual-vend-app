"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wifi, WifiOff, AlertTriangle, ExternalLink, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { GNOSIS_RPC_URL, NETWORK_NAME, CHAIN_ID } from "@/lib/config"

interface NetworkStatusProps {
  isConnected: boolean
  chainId: number | null
  contractExists: boolean | null
}

export function NetworkStatus({ isConnected, chainId, contractExists }: NetworkStatusProps) {
  const [rpcStatus, setRpcStatus] = useState<"checking" | "online" | "offline">("checking")
  const [blockNumber, setBlockNumber] = useState<number | null>(null)

  const isCorrectNetwork = chainId === CHAIN_ID

  useEffect(() => {
    const checkRpcStatus = async () => {
      try {
        const response = await fetch(GNOSIS_RPC_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
            id: 1,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.result) {
            setRpcStatus("online")
            setBlockNumber(Number.parseInt(data.result, 16))
          } else {
            setRpcStatus("offline")
          }
        } else {
          setRpcStatus("offline")
        }
      } catch (error) {
        console.error("RPC status check failed:", error)
        setRpcStatus("offline")
      }
    }

    checkRpcStatus()
    const interval = setInterval(checkRpcStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getNetworkStatusColor = () => {
    if (!isConnected) return "text-gray-500"
    if (!isCorrectNetwork) return "text-yellow-500"
    if (contractExists === false) return "text-red-500"
    if (rpcStatus === "offline") return "text-red-500"
    return "text-green-500"
  }

  const getNetworkStatusIcon = () => {
    if (rpcStatus === "offline" || !isConnected) {
      return <WifiOff className="h-4 w-4" />
    }
    return <Wifi className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Network Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span>Wallet:</span>
            <div className="flex items-center gap-2">
              <span className={isConnected ? "text-green-500" : "text-gray-500"}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span>Network:</span>
            <div className="flex items-center gap-2">
              <span className={getNetworkStatusColor()}>
                {isConnected ? (isCorrectNetwork ? NETWORK_NAME : `Wrong Network (${chainId})`) : "Not Connected"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span>RPC Status:</span>
            <div className="flex items-center gap-2">
              {getNetworkStatusIcon()}
              <span className={rpcStatus === "online" ? "text-green-500" : "text-red-500"}>
                {rpcStatus === "checking" ? "Checking..." : rpcStatus === "online" ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {blockNumber && (
            <div className="flex justify-between items-center">
              <span>Latest Block:</span>
              <Badge variant="outline" className="font-mono text-xs">
                #{blockNumber.toLocaleString()}
              </Badge>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span>Contract:</span>
            <span
              className={contractExists === null ? "text-gray-500" : contractExists ? "text-green-500" : "text-red-500"}
            >
              {contractExists === null ? "Checking..." : contractExists ? "Found" : "Not Found"}
            </span>
          </div>
        </div>

        {/* Status Alerts */}
        {rpcStatus === "offline" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">RPC Connection Failed</div>
                <div className="text-sm">Unable to connect to Gnosis Chain RPC. Please try again later.</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isConnected && !isCorrectNetwork && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Wrong Network</div>
                <div className="text-sm">Please switch to Gnosis Chain to use the vending machine.</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {contractExists === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Contract Not Found</div>
                <div className="text-sm">The vending machine contract was not found on this network.</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://gnosisscan.io", "_blank")}
            className="flex-1 bg-transparent"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Explorer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://bridge.gnosischain.com", "_blank")}
            className="flex-1 bg-transparent"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Bridge
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
