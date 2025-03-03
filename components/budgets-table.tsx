"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import type { Budget, Category, Transaction } from "@/lib/types"
import { formatCurrency, getCurrentMonthYear } from "@/lib/utils"
import { deleteBudget } from "@/lib/actions/budget"
import { useToast } from "@/components/ui/use-toast"

interface BudgetsTableProps {
  budgets: Budget[]
  categories: Category[]
  transactions: Transaction[]
}

export function BudgetsTable({ budgets, categories, transactions }: BudgetsTableProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)
  const { currentMonth, currentYear } = getCurrentMonthYear()

  // Create a map of category IDs to names for quick lookup
  const categoryMap = new Map(categories.map((cat) => [cat._id, cat.name]))

  // Get current month's transactions
  const currentMonthTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear && transaction.amount < 0
  })

  // Calculate spending by category
  const categorySpending = new Map<string, number>()
  currentMonthTransactions.forEach((transaction) => {
    if (transaction.categoryId) {
      const categoryId = transaction.categoryId
      const currentAmount = categorySpending.get(categoryId) || 0
      categorySpending.set(categoryId, currentAmount + Math.abs(transaction.amount))
    }
  })

  // Prepare budget data with spending info
  const budgetData = budgets
    .map((budget) => {
      const categoryId = budget.categoryId
      const spent = categorySpending.get(categoryId) || 0
      const remaining = Math.max(0, budget.amount - spent)
      const percentUsed = budget.amount > 0 ? Math.min(100, (spent / budget.amount) * 100) : 0

      return {
        ...budget,
        categoryName: categoryMap.get(categoryId) || "Uncategorized",
        spent,
        remaining,
        percentUsed,
      }
    })
    .sort((a, b) => b.percentUsed - a.percentUsed)

  const handleDelete = async () => {
    if (!budgetToDelete) return

    setIsDeleting(true)
    try {
      await deleteBudget(budgetToDelete)
      toast({
        title: "Budget deleted",
        description: "The budget has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the budget. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setBudgetToDelete(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budgets</CardTitle>
        <CardDescription>Your budget limits for each spending category</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetData.length > 0 ? (
              budgetData.map((budget) => (
                <TableRow key={budget._id}>
                  <TableCell>{budget.categoryName}</TableCell>
                  <TableCell>{formatCurrency(budget.amount)}</TableCell>
                  <TableCell>{formatCurrency(budget.spent)}</TableCell>
                  <TableCell>{formatCurrency(budget.remaining)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={budget.percentUsed} className="h-2" />
                      <span className="text-xs text-muted-foreground">{budget.percentUsed.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/budgets/${budget._id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setBudgetToDelete(budget._id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the budget from your records.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                              {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No budgets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link href="/budgets/new">
          <Button>Add Budget</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

