"use client"

import { useState } from "react"
import { Edit, Trash2, Home, ShoppingBag, Zap, Car, Film, Gift } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const budgets = [
  {
    id: "1",
    category: "Food",
    icon: ShoppingBag,
    color: "#10b981",
    budget: 600,
    spent: 500,
  },
  {
    id: "2",
    category: "Housing",
    icon: Home,
    color: "#0ea5e9",
    budget: 1500,
    spent: 1200,
  },
  {
    id: "3",
    category: "Transportation",
    icon: Car,
    color: "#f59e0b",
    budget: 400,
    spent: 300,
  },
  {
    id: "4",
    category: "Utilities",
    icon: Zap,
    color: "#f43f5e",
    budget: 200,
    spent: 150,
  },
  {
    id: "5",
    category: "Entertainment",
    icon: Film,
    color: "#8b5cf6",
    budget: 300,
    spent: 200,
  },
  {
    id: "6",
    category: "Shopping",
    icon: Gift,
    color: "#ec4899",
    budget: 400,
    spent: 450,
  },
]

export function BudgetList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setSelectedBudget(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the budget
    console.log(`Deleting budget ${selectedBudget}`)
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <budget.icon className="h-4 w-4" style={{ color: budget.color }} />
                    {budget.category}
                  </div>
                </TableCell>
                <TableCell>${budget.budget.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>${budget.spent.toFixed(2)} spent</span>
                      <span className={budget.spent > budget.budget ? "text-destructive" : ""}>
                        {((budget.spent / budget.budget) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(budget.spent / budget.budget) * 100}
                      className="h-2"
                      indicatorClassName={
                        budget.spent > budget.budget
                          ? "bg-destructive"
                          : budget.spent > budget.budget * 0.9
                            ? "bg-warning"
                            : ""
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(budget.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the budget for this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

