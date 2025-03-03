"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category, Transaction } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

interface RecentTransactionsProps {
  transactions: Transaction[]
  categories: Category[]
}

export function RecentTransactions({ transactions, categories }: RecentTransactionsProps) {
  // Create a map of category IDs to names for quick lookup
  const categoryMap = new Map(categories.map((cat) => [cat._id, cat.name]))

  // Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your most recent financial activity</CardDescription>
        </div>
        <Link href="/transactions">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`rounded-full p-2 ${transaction.amount > 0 ? "bg-emerald-100" : "bg-rose-100"}`}>
                    {transaction.amount > 0 ? (
                      <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)} • {categoryMap.get(transaction.categoryId) || "Uncategorized"}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${transaction.amount > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {transaction.amount > 0 ? "+" : ""}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No recent transactions</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

