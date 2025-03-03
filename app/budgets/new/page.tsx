import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { BudgetForm } from "@/components/budget-form"
import { getCategories } from "@/lib/actions/category"
import { redirect } from "next/navigation"

export default async function NewBudgetPage() {
  const categories = await getCategories()

  if (!categories) {
    redirect("/error")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Add Budget" text="Create a new monthly budget" />
      <div className="grid gap-4">
        <BudgetForm categories={categories} />
      </div>
    </DashboardShell>
  )
}

