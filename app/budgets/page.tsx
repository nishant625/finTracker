import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetList } from "@/components/budget-list"
import { BudgetForm } from "@/components/budget-form"

export default function BudgetsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">Set and manage your monthly spending budgets</p>
        </div>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Budgets</CardTitle>
            <CardDescription>Your monthly category budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetList />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Set Budget</CardTitle>
            <CardDescription>Create or update a category budget</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

