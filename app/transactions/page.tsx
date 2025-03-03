import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TransactionsTable } from "@/components/transactions-table"
import { getTransactions } from "@/lib/actions/transaction"
import { getCategories } from "@/lib/actions/category"

export default async function TransactionsPage() {
  const transactions = await getTransactions()
  const categories = await getCategories()

  if (!transactions || !categories) {
    redirect("/error")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Transactions" text="Manage your transactions">
        <Link href="/transactions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </Link>
      </DashboardHeader>
      <TransactionsTable transactions={transactions} categories={categories} />
    </DashboardShell>
  )
}

