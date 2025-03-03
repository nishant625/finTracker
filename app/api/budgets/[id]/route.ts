import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const budget = await db.collection("budgets").findOne({ _id: new ObjectId(params.id) })

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error("Failed to fetch budget:", error)
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
      updatedAt: new Date(),
    }

    const result = await db.collection("budgets").updateOne({ _id: new ObjectId(params.id) }, { $set: budget })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json({ id: params.id, ...budget })
  } catch (error) {
    console.error("Failed to update budget:", error)
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const result = await db.collection("budgets").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete budget:", error)
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 })
  }
}

