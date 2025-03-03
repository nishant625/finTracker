"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { BudgetProgress } from "@/components/budget-progress"
import { SpendingInsights } from "@/components/spending-insights"

export default function Home() {
  const [dashboardData, setDashboardData] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    savingsRate: 0,
  })

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard")
        if (!res.ok) throw new Error("Failed to fetch dashboard data")
        const data = await res.json()
        setDashboardData(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchDashboard()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-6 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
              <div className="flex-1 space-y-4">
                <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
                  Personal Finance Tracker
                </h1>
                <p className="text-xl text-muted-foreground">Track, visualize, and optimize your personal finances</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/transactions/new">
                  <Button className="h-10">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardData.totalExpenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Updated in real-time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardData.totalIncome.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Updated in real-time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.savingsRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Updated in real-time</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 pt-6 md:grid-cols-6">
              <Card className="col-span-6 md:col-span-4">
                <CardHeader>
                  <CardTitle>Monthly Overview</CardTitle>
                  <CardDescription>Your expense trends for the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-6 md:col-span-2">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Your spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdown />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
