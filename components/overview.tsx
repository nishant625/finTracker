"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function Overview() {
  const [chartData, setChartData] = useState<{ name: string; expenses: number }[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard")
        if (!res.ok) throw new Error("Failed to fetch monthly expenses")

        const data = await res.json()

        if (!data.monthlyExpenses || data.monthlyExpenses.length === 0) {
          throw new Error("No expense data available")
        }

        setChartData(data.monthlyExpenses) // ✅ Set only if valid data exists
      } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred"
        console.error("Error fetching monthly expenses:", errMessage)
        setError(errMessage)
      }
      finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p className="text-center text-muted-foreground">Loading expenses...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData || []}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value) => [`$${value}`, "Expenses"]}
          labelFormatter={(label) => `Month: ${label}`}
          contentStyle={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Bar dataKey="expenses" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  )
}
