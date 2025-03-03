"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Budget, Category, Transaction } from "@/lib/types"
import { formatCurrency, getCurrentMonthYear } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import { useMemo } from "react"
import Link from "next/link"
import { Button } from "./ui/button"

interface BudgetOverviewProps {
  transactions: Transaction[]
  budgets: Budget[]
  categories: Category[]
}

export function BudgetOverview({ transactions, budgets, categories }: BudgetOverviewProps) {
  const { currentMonth, currentYear } = getCurrentMonthYear()

  const budgetData = useMemo(() => {
    // Create a map of category IDs to names
    const categoryMap = new Map(categories.map((cat) => [cat._id, cat.name]))

    // Get current month's transactions
    const currentMonthTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && transaction.amount < 0
    })

    // Calculate spending by category
    const categorySpending = new Map<string, number>()
    currentMonthTransactions.forEach((transaction) => {
      if (transaction.categoryId) {
        const categoryId = transaction.categoryId
        const currentAmount = categorySpending.get(categoryId) || 0
        categorySpending.set(categoryId, currentAmount + Math.abs(transaction.amount))
      }
    })

    // Combine with budget data
    return budgets
      .map((budget) => {
        const categoryId = budget.categoryId
        const categoryName = categoryMap.get(categoryId) || "Uncategorized"
        const spent = categorySpending.get(categoryId) || 0
        const remaining = Math.max(0, budget.amount - spent)
        const percentUsed = budget.amount > 0 ? Math.min(100, (spent / budget.amount) * 100) : 0

        return {
          name: categoryName,
          budget: budget.amount,
          spent: spent,
          remaining: remaining,
          percentUsed: percentUsed,
        }
      })
      .sort((a, b) => b.percentUsed - a.percentUsed)
  }, [transactions, budgets, categories, currentMonth, currentYear])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Budget vs. Actual</CardTitle>
          <CardDescription>
            Your spending compared to budget for{" "}
            {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })}
          </CardDescription>
        </div>
        <Link href="/budgets">
          <Button variant="outline" size="sm">
            Manage Budgets
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {budgetData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value, { notation: "compact" })} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "budget") return [formatCurrency(Number(value)), "Budget"]
                    if (name === "spent") return [formatCurrency(Number(value)), "Spent"]
                    return [value, name]
                  }}
                />
                <Legend />
                <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                <ReferenceLine x={0} stroke="#666" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground">No budget data available</p>
              <Link href="/budgets/new">
                <Button size="sm">Create Budget</Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

