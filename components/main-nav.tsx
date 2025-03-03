import type React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { BarChart3 } from "lucide-react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <BarChart3 className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Finance Tracker</span>
      </Link>
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
          Dashboard
        </Link>
        <Link
          href="/transactions"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Transactions
        </Link>
        <Link
          href="/budgets"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Budgets
        </Link>
      </nav>
    </div>
  )
}

