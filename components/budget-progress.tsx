"use client"

import { Progress } from "@/components/ui/progress"

const budgets = [
  {
    category: "Housing",
    budget: 1500,
    spent: 1200,
    color: "#0ea5e9",
  },
  {
    category: "Food",
    budget: 600,
    spent: 500,
    color: "#10b981",
  },
  {
    category: "Transportation",
    budget: 400,
    spent: 300,
    color: "#f59e0b",
  },
  {
    category: "Entertainment",
    budget: 300,
    spent: 200,
    color: "#8b5cf6",
  },
  {
    category: "Utilities",
    budget: 200,
    spent: 150,
    color: "#f43f5e",
  },
]

export function BudgetProgress() {
  return (
    <div className="space-y-4">
      {budgets.map((item) => (
        <div key={item.category} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium">{item.category}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ${item.spent} / ${item.budget}
            </span>
          </div>
          <Progress
            value={(item.spent / item.budget) * 100}
            className="h-2"
            indicatorClassName={
              item.spent > item.budget ? "bg-destructive" : item.spent > item.budget * 0.9 ? "bg-warning" : ""
            }
          />
        </div>
      ))}
    </div>
  )
}

