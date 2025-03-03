import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TransactionForm } from "@/components/transaction-form"
import { getCategories } from "@/lib/actions/category"
import { getTransactionById } from "@/lib/actions/transaction"
import { notFound, redirect } from "next/navigation"

interface EditTransactionPageProps {
  params: {
    id: string
  }
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const transaction = await getTransactionById(params.id)
  const categories = await getCategories()

  if (!transaction) {
    notFound()
  }

  if (!categories) {
    redirect("/error")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Transaction" text="Update transaction details" />
      <div className="grid gap-4">
        <TransactionForm transaction={transaction} categories={categories} />
      </div>
    </DashboardShell>
  )
}

