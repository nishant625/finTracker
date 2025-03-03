import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    console.log("Fetching dashboard data for:", startOfMonth)

    // Get total expenses (ensure absolute value)
    const expenses = await db.collection("transactions").aggregate([
      {
        $match: {
          date: { $gte: new Date(startOfMonth) },
          amount: { $lt: 0 }, // Expenses only
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $abs: "$amount" } }, // Convert to positive
        },
      },
    ]).toArray()

    // Get total income
    const income = await db.collection("transactions").aggregate([
      {
        $match: {
          date: { $gte: new Date(startOfMonth) },
          amount: { $gt: 0 }, // Income only
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]).toArray()

    // Compute values
    const totalExpenses = expenses.length > 0 ? expenses[0].total : 0
    const totalIncome = income.length > 0 ? income[0].total : 0
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    console.log("Dashboard Data:", { totalExpenses, totalIncome, savingsRate })

    return NextResponse.json({ totalExpenses, totalIncome, savingsRate })
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
