import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { SummaryCards } from "@/components/summary-cards"
import { BudgetOverview } from "@/components/budget-overview"
import { SpendingInsights } from "@/components/spending-insights"
import { getTransactions } from "@/lib/actions/transaction"
import { getCategories } from "@/lib/actions/category"
import { getBudgets } from "@/lib/actions/budget"

export default async function DashboardPage() {
  const transactions = await getTransactions()
  const categories = await getCategories()
  const budgets = await getBudgets()

  if (!transactions || !categories) {
    redirect("/error")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Finance Dashboard" text="Track and manage your personal finances" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCards transactions={transactions} budgets={budgets} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Overview transactions={transactions} />
        </div>
        <div className="col-span-3">
          <CategoryBreakdown transactions={transactions} categories={categories} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <BudgetOverview transactions={transactions} budgets={budgets} categories={categories} />
        <SpendingInsights transactions={transactions} budgets={budgets} categories={categories} />
      </div>
      <div className="mt-4">
        <RecentTransactions transactions={transactions} categories={categories} />
      </div>
    </DashboardShell>
  )
}

