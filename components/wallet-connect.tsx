"use client"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
        <Button variant="outline" size="sm" onClick={() => disconnect()} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          variant="outline"
          size="sm"
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="flex items-center gap-2"
        >
          <Wallet className="h-4 w-4" />
          {connector.name}
        </Button>
      ))}
    </div>
  )
}
