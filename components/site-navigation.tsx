"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { WalletConnect } from "@/components/wallet-connect"
import { ModeToggle } from "@/components/mode-toggle"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Vending Machine", href: "/vending-machine" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Funding", href: "/funding" },
]

export function SiteNavigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">Mutual Vend</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* Mobile menu would go here */}</div>
          <nav className="flex items-center space-x-2">
            <WalletConnect />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
