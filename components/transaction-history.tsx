"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, CheckCircle, XCircle, ExternalLink, Package } from "lucide-react"
import type { TransactionStatus } from "@/lib/types"

interface TransactionHistoryProps {
  transactions: TransactionStatus[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getStatusIcon = (status: TransactionStatus["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: TransactionStatus["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "confirmed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
            Confirmed
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
    }
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Purchases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent purchases</p>
            <p className="text-sm">Your transaction history will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Recent Purchases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(tx.status)}
                  <div>
                    <div className="font-medium">{tx.trackId !== undefined ? `Track ${tx.trackId}` : "Purchase"}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{formatTime(tx.timestamp)}</div>
                    {tx.voteTokensEarned && tx.status === "confirmed" && (
                      <div className="text-xs text-green-600 dark:text-green-400">🗳️ Vote tokens earned</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(tx.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://gnosisscan.io/tx/${tx.hash}`, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
