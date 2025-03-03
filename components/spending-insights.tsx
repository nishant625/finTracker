"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Budget, Category, Transaction } from "@/lib/types"
import { formatCurrency, getCurrentMonthYear } from "@/lib/utils"
import { useMemo } from "react"
import { AlertCircle, AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react"

interface SpendingInsightsProps {
  transactions: Transaction[]
  budgets: Budget[]
  categories: Category[]
}

export function SpendingInsights({ transactions, budgets, categories }: SpendingInsightsProps) {
  const { currentMonth, currentYear } = getCurrentMonthYear()

  const insights = useMemo(() => {
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

    // Get previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Get previous month's transactions
    const prevMonthTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.date)
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear && transaction.amount < 0
    })

    // Calculate previous month's spending by category
    const prevCategorySpending = new Map<string, number>()
    prevMonthTransactions.forEach((transaction) => {
      if (transaction.categoryId) {
        const categoryId = transaction.categoryId
        const currentAmount = prevCategorySpending.get(categoryId) || 0
        prevCategorySpending.set(categoryId, currentAmount + Math.abs(transaction.amount))
      }
    })

    // Generate insights
    const result = []

    // Budget insights
    budgets.forEach((budget) => {
      const categoryId = budget.categoryId
      const categoryName = categoryMap.get(categoryId) || "Uncategorized"
      const spent = categorySpending.get(categoryId) || 0
      const percentUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

      if (percentUsed >= 90) {
        result.push({
          type: "warning",
          icon: AlertTriangle,
          message: `You've used ${percentUsed.toFixed(0)}% of your ${categoryName} budget (${formatCurrency(spent)} of ${formatCurrency(budget.amount)})`,
        })
      } else if (percentUsed <= 20 && currentMonth > 0 && new Date().getDate() > 20) {
        result.push({
          type: "success",
          icon: CheckCircle,
          message: `You're well under your ${categoryName} budget with only ${percentUsed.toFixed(0)}% used`,
        })
      }
    })

    // Spending trend insights
    categories.forEach((category) => {
      const categoryId = category._id
      const currentSpent = categorySpending.get(categoryId) || 0
      const prevSpent = prevCategorySpending.get(categoryId) || 0

      if (currentSpent > 0 && prevSpent > 0) {
        const percentChange = ((currentSpent - prevSpent) / prevSpent) * 100

        if (percentChange >= 50) {
          result.push({
            type: "alert",
            icon: TrendingUp,
            message: `Your ${category.name} spending increased by ${percentChange.toFixed(0)}% compared to last month`,
          })
        } else if (percentChange <= -30) {
          result.push({
            type: "info",
            icon: TrendingDown,
            message: `Your ${category.name} spending decreased by ${Math.abs(percentChange).toFixed(0)}% compared to last month`,
          })
        }
      }
    })

    // Limit to 5 insights
    return result.slice(0, 5)
  }, [transactions, budgets, categories, currentMonth, currentYear])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>Smart observations about your spending habits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`rounded-full p-1.5 ${
                    insight.type === "warning"
                      ? "bg-amber-100 text-amber-600"
                      : insight.type === "alert"
                        ? "bg-rose-100 text-rose-600"
                        : insight.type === "success"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <insight.icon className="h-4 w-4" />
                </div>
                <p className="text-sm">{insight.message}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-center text-muted-foreground">Not enough data to generate insights yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

