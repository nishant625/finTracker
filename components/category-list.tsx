"use client"

import { useState } from "react"
import { Edit, Trash2, Home, ShoppingBag, Zap, ArrowDownLeft, Car, Film, Gift } from "lucide-react"

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

const categories = [
  {
    id: "1",
    name: "Food",
    icon: ShoppingBag,
    color: "#10b981",
    transactionCount: 24,
  },
  {
    id: "2",
    name: "Housing",
    icon: Home,
    color: "#0ea5e9",
    transactionCount: 12,
  },
  {
    id: "3",
    name: "Transportation",
    icon: Car,
    color: "#f59e0b",
    transactionCount: 18,
  },
  {
    id: "4",
    name: "Utilities",
    icon: Zap,
    color: "#f43f5e",
    transactionCount: 8,
  },
  {
    id: "5",
    name: "Entertainment",
    icon: Film,
    color: "#8b5cf6",
    transactionCount: 15,
  },
  {
    id: "6",
    name: "Shopping",
    icon: Gift,
    color: "#ec4899",
    transactionCount: 10,
  },
  {
    id: "7",
    name: "Income",
    icon: ArrowDownLeft,
    color: "#14b8a6",
    transactionCount: 5,
  },
]

export function CategoryList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setSelectedCategory(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the category
    console.log(`Deleting category ${selectedCategory}`)
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" style={{ color: category.color }} />
                    {category.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-xs text-muted-foreground">{category.color}</span>
                  </div>
                </TableCell>
                <TableCell>{category.transactionCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(category.id)}>
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
              This action cannot be undone. This will permanently delete the category and may affect transactions using
              this category.
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

