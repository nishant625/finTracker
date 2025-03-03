"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category, Budget } from "@/lib/types"
import { createBudget, updateBudget } from "@/lib/actions/budget"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "Please select a category.",
  }),
  amount: z.coerce.number().positive({
    message: "Budget amount must be positive.",
  }),
})

interface BudgetFormProps {
  budget?: Budget
  categories: Category[]
}

export function BudgetForm({ budget, categories }: BudgetFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter out categories that already have a budget (unless it's the current budget being edited)
  const availableCategories = categories.filter((category) => {
    if (budget && category._id === budget.categoryId) {
      return true
    }
    return !budget?.categoryId
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: budget?.categoryId || "",
      amount: budget?.amount || 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      if (budget) {
        await updateBudget({
          _id: budget._id,
          ...values,
        })
        toast({
          title: "Budget updated",
          description: "Your budget has been updated successfully.",
        })
      } else {
        await createBudget(values)
        toast({
          title: "Budget created",
          description: "Your budget has been created successfully.",
        })
      }
      router.push("/budgets")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select a category for this budget.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input type="number" step="0.01" placeholder="0.00" className="pl-7" {...field} />
                  </div>
                </FormControl>
                <FormDescription>The maximum amount you want to spend in this category per month.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : budget ? "Update Budget" : "Create Budget"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

