import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const category = await db.collection("categories").findOne({ _id: new ObjectId(params.id) })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to fetch category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const data = await request.json()

    // Format the data
    const category = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("categories").updateOne({ _id: new ObjectId(params.id) }, { $set: category })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ id: params.id, ...category })
  } catch (error) {
    console.error("Failed to update category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("finance-tracker")

    // Check if category is used in any transactions
    const transactionCount = await db.collection("transactions").countDocuments({ categoryId: params.id })

    if (transactionCount > 0) {
      return NextResponse.json({ error: "Cannot delete category that is used in transactions" }, { status: 400 })
    }

    const result = await db.collection("categories").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}

