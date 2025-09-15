import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/components/web3-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mutual Vend - Decentralized Vending Machines",
  description: "Revolutionary crypto-powered vending machines with shared ownership and rewards",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
          <Toaster position="top-right" />
        </Web3Provider>
      </body>
    </html>
  )
}
