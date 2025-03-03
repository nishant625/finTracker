"use server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/db"
import type { Category } from "@/lib/types"

const DB_NAME = "finance_tracker"
const COLLECTION_NAME = "categories"

export async function getCategories(): Promise<Category[]> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const categories = await db.collection(COLLECTION_NAME).find({}).sort({ name: 1 }).toArray()

    return categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
    })) as Category[]
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    throw new Error("Failed to fetch categories")
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const category = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) })

    if (!category) return null

    return {
      ...category,
      _id: category._id.toString(),
    } as Category
  } catch (error) {
    console.error(`Failed to fetch category with ID ${id}:`, error)
    throw new Error(`Failed to fetch category with ID ${id}`)
  }
}

