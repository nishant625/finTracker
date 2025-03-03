import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray()

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const data = await request.json()

    // Format the data
    const transaction = {
      ...data,
      amount: Number(data.amount),
      date: new Date(data.date),
      createdAt: new Date(),
    }

    const result = await db.collection("transactions").insertOne(transaction)

    return NextResponse.json(
      {
        id: result.insertedId,
        ...transaction,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Failed to create transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}

