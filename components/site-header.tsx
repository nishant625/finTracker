import Link from "next/link"
import { Home, PiggyBank, Target } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden sm:flex")}>
              <Home className="h-5 w-5" />
              <span className="sr-only">Dashboard</span>
            </Link>
            <Link
              href="/transactions"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden sm:flex")}
            >
              <PiggyBank className="h-5 w-5" />
              <span className="sr-only">Transactions</span>
            </Link>
            <Link href="/budgets" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden sm:flex")}>
              <Target className="h-5 w-5" />
              <span className="sr-only">Budgets</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

