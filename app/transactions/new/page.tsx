import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TransactionForm } from "@/components/transaction-form"
import { getCategories } from "@/lib/actions/category"
import { redirect } from "next/navigation"

export default async function NewTransactionPage() {
  const categories = await getCategories()

  if (!categories) {
    redirect("/error")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Add Transaction" text="Create a new transaction record" />
      <div className="grid gap-4">
        <TransactionForm categories={categories} />
      </div>
    </DashboardShell>
  )
}

