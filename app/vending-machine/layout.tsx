import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vending Machine | Mutual Vend",
  description: "Purchase snacks and earn vote tokens from our blockchain vending machine",
}

export default function VendingMachineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
