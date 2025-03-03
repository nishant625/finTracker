import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { BudgetForm } from "@/components/budget-form"
import { getCategories } from "@/lib/actions/category"
import { getBudgetById } from "@/lib/actions/budget"
import { notFound, redirect } from "next/navigation"

interface EditBudgetPageProps {
  params: {
    id: string
  }
}

export default async function EditBudgetPage({ params }: EditBudgetPageProps) {
  const budget = await getBudgetById(params.id)
  const categories = await getCategories()

  if (!budget) {
    notFound()
  }

  if (!categories) {
    redirect("/error")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Budget" text="Update budget details" />
      <div className="grid gap-4">
        <BudgetForm budget={budget} categories={categories} />
      </div>
    </DashboardShell>
  )
}

