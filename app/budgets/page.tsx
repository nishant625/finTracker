import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { BudgetsTable } from "@/components/budgets-table"
import { getBudgets } from "@/lib/actions/budget"
import { getCategories } from "@/lib/actions/category"
import { getTransactions } from "@/lib/actions/transaction"

export default async function BudgetsPage() {
  const budgets = await getBudgets()
  const categories = await getCategories()
  const transactions = await getTransactions()

  if (!budgets || !categories || !transactions) {
    redirect("/error")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Budgets" text="Manage your monthly budgets">
        <Link href="/budgets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        </Link>
      </DashboardHeader>
      <BudgetsTable budgets={budgets} categories={categories} transactions={transactions} />
    </DashboardShell>
  )
}

