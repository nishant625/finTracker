import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

// Sample data
const categories = [
  { name: "Food", icon: "ShoppingBag", color: "#10b981" },
  { name: "Housing", icon: "Home", color: "#0ea5e9" },
  { name: "Transportation", icon: "Car", color: "#f59e0b" },
  { name: "Utilities", icon: "Zap", color: "#f43f5e" },
  { name: "Entertainment", icon: "Film", color: "#8b5cf6" },
  { name: "Shopping", icon: "Gift", color: "#ec4899" },
  { name: "Income", icon: "ArrowDownLeft", color: "#14b8a6" },
]

const transactions = [
  { description: "Grocery Shopping", amount: -120.5, date: new Date("2024-01-15"), category: "Food" },
  { description: "Salary Deposit", amount: 3200.0, date: new Date("2024-01-10"), category: "Income" },
  { description: "Electric Bill", amount: -85.75, date: new Date("2024-01-05"), category: "Utilities" },
  { description: "Coffee Shop", amount: -4.5, date: new Date("2024-01-03"), category: "Food" },
  { description: "Rent Payment", amount: -1200.0, date: new Date("2024-01-01"), category: "Housing" },
  { description: "Gas Station", amount: -45.0, date: new Date("2023-12-28"), category: "Transportation" },
  { description: "Movie Tickets", amount: -24.0, date: new Date("2023-12-25"), category: "Entertainment" },
  { description: "Online Shopping", amount: -67.99, date: new Date("2023-12-22"), category: "Shopping" },
]

const budgets = [
  { category: "Food", budget: 600, month: 1, year: 2024 },
  { category: "Housing", budget: 1500, month: 1, year: 2024 },
  { category: "Transportation", budget: 400, month: 1, year: 2024 },
  { category: "Utilities", budget: 200, month: 1, year: 2024 },
  { category: "Entertainment", budget: 300, month: 1, year: 2024 },
  { category: "Shopping", budget: 400, month: 1, year: 2024 },
]

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    // ✅ 1. Clear existing data
    await db.collection("categories").deleteMany({})
    await db.collection("transactions").deleteMany({})
    await db.collection("budgets").deleteMany({})

    // ✅ 2. Insert categories
    await db.collection("categories").insertMany(categories)

    // ✅ 3. Insert transactions without category ID mapping
    await db.collection("transactions").insertMany(transactions)

    // ✅ 4. Insert budgets
    await db.collection("budgets").insertMany(budgets.map(budget => ({
      ...budget,
      amount: budget.budget,
    })))

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      transactions: transactions.length,
      budgets: budgets.length,
      categories: categories.length,
    })
  } catch (error) {
    console.error("Failed to seed database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
