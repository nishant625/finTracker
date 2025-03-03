import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const categories = await db.collection("categories").find({}).toArray()

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const data = await request.json()

    // Format the data
    const category = {
      ...data,
      createdAt: new Date(),
    }

    const result = await db.collection("categories").insertOne(category)

    return NextResponse.json(
      {
        id: result.insertedId,
        ...category,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Failed to create category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

