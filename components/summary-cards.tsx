"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Budget, Transaction } from "@/lib/types"
import { formatCurrency, getCurrentMonthYear } from "@/lib/utils"
import { ArrowUpIcon, DollarSign, Target } from "lucide-react"
import { useMemo } from "react"

interface SummaryCardsProps {
  transactions: Transaction[]
  budgets?: Budget[]
}

export function SummaryCards({ transactions, budgets = [] }: SummaryCardsProps) {
  const { currentMonth, currentYear } = getCurrentMonthYear()

  const { totalIncome, totalExpenses, balance, monthlyBudget, monthlySpent } = useMemo(() => {
    let income = 0
    let expenses = 0
    let monthlyExpenses = 0

    // Calculate total income and expenses
    transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount
      } else {
        expenses += Math.abs(transaction.amount)

        // Check if transaction is from current month
        const date = new Date(transaction.date)
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          monthlyExpenses += Math.abs(transaction.amount)
        }
      }
    })

    // Calculate total budget for the month
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      monthlyBudget: totalBudget,
      monthlySpent: monthlyExpenses,
    }
  }, [transactions, budgets, currentMonth, currentYear])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          <p className="text-xs text-muted-foreground">Current available balance</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground">Total income received</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{formatCurrency(monthlySpent)}</div>
            <div className="text-sm text-muted-foreground">/ {formatCurrency(monthlyBudget)}</div>
          </div>
          <p className="text-xs text-muted-foreground">
            {monthlyBudget > 0
              ? `${((monthlySpent / monthlyBudget) * 100).toFixed(0)}% of monthly budget used`
              : "No monthly budget set"}
          </p>
        </CardContent>
      </Card>
    </>
  )
}

