"use client"

import Link from "next/link"
import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionList } from "@/components/transaction-list"
import { TransactionFilters } from "@/components/transaction-filters"

export default function TransactionsPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    amount: "any",
    date: undefined as Date | undefined,
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View and manage all your financial transactions</p>
        </div>
        <Link href="/transactions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </Link>
      </div>
      <div className="mt-8 grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Browse and filter your transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionFilters filters={filters} setFilters={setFilters} />
            <div className="mt-6">
              <TransactionList filters={filters} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
