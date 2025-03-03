"use client"

import { formatDistanceToNow } from "date-fns"
import { ArrowDownLeft, Coffee, Home, ShoppingBag, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

const transactions = [
  {
    id: "1",
    description: "Grocery Shopping",
    amount: -120.5,
    date: new Date(2023, 6, 15),
    category: "Food",
    icon: ShoppingBag,
  },
  {
    id: "2",
    description: "Salary Deposit",
    amount: 3200.0,
    date: new Date(2023, 6, 10),
    category: "Income",
    icon: ArrowDownLeft,
  },
  {
    id: "3",
    description: "Electric Bill",
    amount: -85.75,
    date: new Date(2023, 6, 5),
    category: "Utilities",
    icon: Zap,
  },
  {
    id: "4",
    description: "Coffee Shop",
    amount: -4.5,
    date: new Date(2023, 6, 3),
    category: "Food",
    icon: Coffee,
  },
  {
    id: "5",
    description: "Rent Payment",
    amount: -1200.0,
    date: new Date(2023, 6, 1),
    category: "Housing",
    icon: Home,
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              transaction.amount > 0
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-primary/10 text-primary",
            )}
          >
            <transaction.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(transaction.date, { addSuffix: true })}
            </p>
          </div>
          <div
            className={cn("text-sm font-medium", transaction.amount > 0 ? "text-green-600 dark:text-green-400" : "")}
          >
            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}

