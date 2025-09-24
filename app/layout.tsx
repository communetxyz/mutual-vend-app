import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/components/web3-provider"
import { SiteNavigation } from "@/components/site-navigation"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mutual Vend - Decentralized Vending Machines",
  description: "The future of vending machines powered by blockchain technology",
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
          <SiteNavigation />
          <main>{children}</main>
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  )
}
