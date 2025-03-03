"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category, Transaction } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useMemo } from "react"

interface CategoryBreakdownProps {
  transactions: Transaction[]
  categories: Category[]
}

export function CategoryBreakdown({ transactions, categories }: CategoryBreakdownProps) {
  const categoryData = useMemo(() => {
    // Create a map of category IDs to names
    const categoryMap = new Map(categories.map((cat) => [cat._id, cat.name]))

    // Initialize data structure to track expenses by category
    const categoryExpenses = new Map<string, number>()

    // Sum expenses by category
    transactions.forEach((transaction) => {
      if (transaction.amount < 0 && transaction.categoryId) {
        const categoryId = transaction.categoryId
        const currentAmount = categoryExpenses.get(categoryId) || 0
        categoryExpenses.set(categoryId, currentAmount + Math.abs(transaction.amount))
      }
    })

    // Convert to array format for the pie chart
    const data = Array.from(categoryExpenses.entries()).map(([categoryId, amount]) => ({
      name: categoryMap.get(categoryId) || "Uncategorized",
      value: amount,
    }))

    // Sort by value descending
    return data.sort((a, b) => b.value - a.value)
  }, [transactions, categories])

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Your expenses by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No expense data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

