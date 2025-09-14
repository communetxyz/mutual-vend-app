"use client"

import React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Bot, Printer, Wrench, PieChart, TrendingUp, Diamond, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

export function SiteNavigation() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Bot className="h-6 w-6" />
        <span className="ml-2 text-lg font-bold">Mutual Vend</span>
      </Link>
      <NavigationMenu className="ml-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium">Learn</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-4">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/how-it-works"
                    >
                      <Bot className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">How It Works</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Deep dive into stocking and revenue sharing mechanisms that power our network.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/#features" title="Features">
                  Explore the core features that make Mutual Vend revolutionary.
                </ListItem>
                <ListItem href="/zk-verification" title="ZK Verification">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Trustless verification using zero-knowledge proofs
                  </div>
                </ListItem>
                <ListItem href="/#faq" title="FAQ">
                  Get answers to frequently asked questions about the platform.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium">Build</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem href="/#blueprints" title="Blueprints">
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    Download 3D printing files and assembly guides
                  </div>
                </ListItem>
                <ListItem href="/fabrication-research" title="Research">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Open-source fabrication research and development
                  </div>
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium">Earn</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
                <ListItem href="/revenue-share" title="Revenue Share">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Earn profits from every purchase for 2 weeks using stablecoins
                  </div>
                </ListItem>
                <ListItem href="/liquid-ownership" title="Liquid Ownership">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Buy and sell fractionalized machine ownership
                  </div>
                </ListItem>
                <ListItem href="/lottery" title="Lossless Lottery">
                  <div className="flex items-center gap-2">
                    <Diamond className="h-4 w-4" />
                    Win machines through fair, no-loss auctions
                  </div>
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
