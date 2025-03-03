"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Edit, Trash2, Coffee, Home, ShoppingBag, Zap, ArrowDownLeft, Car, Film, Gift, Loader2 } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { getTransaction, deleteTransaction } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

const categoryIcons = {
  Food: ShoppingBag,
  Income: ArrowDownLeft,
  Utilities: Zap,
  Coffee: Coffee,
  Housing: Home,
  Transportation: Car,
  Entertainment: Film,
  Shopping: Gift,
}

type Transaction = {
  _id: string
  description: string
  amount: number
  type: "income" | "expense"
  date: string | Date
  category: string
}

export function TransactionList({ filters }: { filters: Record<string, any> }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      try {
        const queryParams = new URLSearchParams()

        if (filters.search) queryParams.append("search", filters.search)
        if (filters.category && filters.category !== "all") queryParams.append("category", filters.category)
        if (filters.amount && filters.amount !== "any") queryParams.append("amount", filters.amount)
        if (filters.date) queryParams.append("date", new Date(filters.date).toISOString())

        const queryString = queryParams.toString()
        const data = await getTransaction(queryString ? `?${queryString}` : "") // ✅ Fix API call

        setTransactions(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching transactions:", err)
        setError("Failed to load transactions. Try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [filters]) // Re-fetch when filters change

  const handleDelete = (id: string) => {
    setSelectedTransaction(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedTransaction) return

    try {
      setIsLoading(true)
      await deleteTransaction(selectedTransaction)

      // Remove deleted transaction from state
      setTransactions((prev) => prev.filter((t) => t._id !== selectedTransaction))

      toast({
        title: "Transaction deleted",
        description: "The transaction has been successfully deleted.",
      })
    } catch (err) {
      console.error("Error deleting transaction:", err)
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
          <p className="text-yellow-700">{error}</p>
        </div>
      )}

      <div className="rounded-md border">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading transactions...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No transactions found. Try adjusting your filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const IconComponent = categoryIcons[transaction.category as keyof typeof categoryIcons] || ShoppingBag

                return (
                  <TableRow key={transaction._id}>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex w-fit items-center gap-1">
                        <IconComponent className="h-3 w-3" />
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        transaction.type === "expense" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                      )}
                    >
                      {transaction.type === "expense" ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}
