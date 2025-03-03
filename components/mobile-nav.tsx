"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, Menu } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
        <MobileLink href="/" className="flex items-center" onOpenChange={setOpen}>
          <BarChart3 className="mr-2 h-5 w-5" />
          <span className="font-bold">Finance Tracker</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <MobileLink
              href="/"
              onOpenChange={setOpen}
              className={cn(pathname === "/" ? "text-foreground" : "text-muted-foreground")}
            >
              Dashboard
            </MobileLink>
            <MobileLink
              href="/transactions"
              onOpenChange={setOpen}
              className={cn(pathname?.startsWith("/transactions") ? "text-foreground" : "text-muted-foreground")}
            >
              Transactions
            </MobileLink>
            <MobileLink
              href="/budgets"
              onOpenChange={setOpen}
              className={cn(pathname?.startsWith("/budgets") ? "text-foreground" : "text-muted-foreground")}
            >
              Budgets
            </MobileLink>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const handleClick = () => {
    onOpenChange?.(false)
  }

  return (
    <Link href={href} onClick={handleClick} className={cn(className)} {...props}>
      {children}
    </Link>
  )
}

