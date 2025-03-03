import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const budgets = await db.collection("budgets").find({}).toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Failed to fetch budgets:", error)
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const data = await request.json()

    // Format the data
    const budget = {
      ...data,
      amount: Number(data.amount),
      month: Number(data.month),
      year: Number(data.year),
      createdAt: new Date(),
    }

    // Check if budget already exists for this category, month, and year
    const existingBudget = await db.collection("budgets").findOne({
      categoryId: budget.categoryId,
      month: budget.month,
      year: budget.year,
    })

    if (existingBudget) {
      // Update existing budget
      await db
        .collection("budgets")
        .updateOne({ _id: existingBudget._id }, { $set: { amount: budget.amount, updatedAt: new Date() } })

      return NextResponse.json({
        id: existingBudget._id,
        ...budget,
        message: "Budget updated",
      })
    }

    // Create new budget
    const result = await db.collection("budgets").insertOne(budget)

    return NextResponse.json(
      {
        id: result.insertedId,
        ...budget,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Failed to create budget:", error)
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 })
  }
}

