"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Bot, Wallet, Home, Info, DollarSign, Zap, Trophy, Shuffle, Beaker } from "lucide-react"
import { useState } from "react"
import { WalletConnect } from "./wallet-connect"
import { useAccount } from "wagmi"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "How It Works", href: "/how-it-works", icon: Info },
  { name: "Vending Machine", href: "/vending-machine", icon: Bot, badge: "Live" },
  { name: "Revenue Share", href: "/revenue-share", icon: DollarSign },
  { name: "ZK Verification", href: "/zk-verification", icon: Zap },
  { name: "Lottery", href: "/lottery", icon: Trophy },
  { name: "Liquid Ownership", href: "/liquid-ownership", icon: Shuffle },
  { name: "Fabrication Research", href: "/fabrication-research", icon: Beaker },
  { name: "Funding", href: "/funding", icon: DollarSign },
]

export function SiteNavigation() {
  const pathname = usePathname()
  const { isConnected } = useAccount()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Mutual Vend</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.slice(0, 4).map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 transition-colors hover:text-foreground/80 ${
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
              <Bot className="h-6 w-6" />
              <span className="font-bold">Mutual Vend</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2 transition-colors hover:text-foreground/80 ${
                        pathname === item.href ? "text-foreground" : "text-foreground/60"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <Bot className="h-6 w-6" />
              <span className="font-bold">Mutual Vend</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <div className="hidden md:block">
              <WalletConnect />
            </div>
            {isConnected && (
              <Badge variant="outline" className="hidden md:flex">
                <Wallet className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
