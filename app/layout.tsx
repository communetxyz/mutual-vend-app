import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteNavigation } from "@/components/site-navigation"
import { Web3Provider } from "@/components/web3-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mutual Vend - Decentralized Vending Machine Network",
  description:
    "A cooperative vending machine network powered by blockchain technology, featuring liquid ownership, zero-knowledge verification, and transparent revenue sharing.",
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
          <div className="min-h-screen bg-background">
            <SiteNavigation />
            <main className="pt-16">{children}</main>
          </div>
          <Toaster position="top-right" />
        </Web3Provider>
      </body>
    </html>
  )
}
