"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMemo } from "react"

interface OverviewProps {
  transactions: Transaction[]
}

export function Overview({ transactions }: OverviewProps) {
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentYear = new Date().getFullYear()

    // Initialize data for all months with 0
    const data = months.map((month) => ({
      name: month,
      expenses: 0,
    }))

    // Sum expenses by month
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      if (date.getFullYear() === currentYear && transaction.amount < 0) {
        const monthIndex = date.getMonth()
        data[monthIndex].expenses += Math.abs(transaction.amount)
      }
    })

    return data
  }, [transactions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Your expense trends throughout the year</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value, { notation: "compact" })} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="expenses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

