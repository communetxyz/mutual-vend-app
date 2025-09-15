"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Zap, ShoppingCart, Users, Shield, Trophy, PieChart, DollarSign, Wrench, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Vending Machine",
    href: "/vending-machine",
    icon: ShoppingCart,
    description: "Purchase products with crypto",
  },
  {
    name: "How It Works",
    href: "/how-it-works",
    icon: BookOpen,
    description: "Learn about our system",
  },
  {
    name: "Liquid Ownership",
    href: "/liquid-ownership",
    icon: Users,
    description: "Cooperative ownership model",
  },
  {
    name: "Revenue Share",
    href: "/revenue-share",
    icon: DollarSign,
    description: "Earn from network success",
  },
  {
    name: "ZK Verification",
    href: "/zk-verification",
    icon: Shield,
    description: "Privacy-preserving identity",
  },
  {
    name: "Lottery",
    href: "/lottery",
    icon: Trophy,
    description: "Community lottery system",
  },
  {
    name: "Fabrication",
    href: "/fabrication-research",
    icon: Wrench,
    description: "Build your own machine",
  },
  {
    name: "Funding",
    href: "/funding",
    icon: PieChart,
    description: "Investment opportunities",
  },
]

export function SiteNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">Mutual Vend</span>
            </Link>

            <Badge variant="outline" className="hidden sm:inline-flex">
              Beta
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">Mutual Vend</span>
                <Badge variant="outline">Beta</Badge>
              </div>

              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-start space-x-3 px-3 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs opacity-70 mt-1">{item.description}</div>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
