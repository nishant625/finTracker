"use server"

import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/db"
import type { Budget } from "@/lib/types"

const DB_NAME = "finance_tracker"
const COLLECTION_NAME = "budgets"

export async function getBudgets(): Promise<Budget[]> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const budgets = await db.collection(COLLECTION_NAME).find({}).toArray()

    return budgets.map((budget) => ({
      ...budget,
      _id: budget._id.toString(),
    })) as Budget[]
  } catch (error) {
    console.error("Failed to fetch budgets:", error)
    throw new Error("Failed to fetch budgets")
  }
}

export async function getBudgetById(id: string): Promise<Budget | null> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const budget = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) })

    if (!budget) return null

    return {
      ...budget,
      _id: budget._id.toString(),
    } as Budget
  } catch (error) {
    console.error(`Failed to fetch budget with ID ${id}:`, error)
    throw new Error(`Failed to fetch budget with ID ${id}`)
  }
}

export async function createBudget(data: Omit<Budget, "_id">): Promise<Budget> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)

    // Check if a budget for this category already exists
    const existingBudget = await db.collection(COLLECTION_NAME).findOne({ categoryId: data.categoryId })

    if (existingBudget) {
      throw new Error("A budget for this category already exists")
    }

    const now = new Date()
    const budget = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(COLLECTION_NAME).insertOne(budget)

    revalidatePath("/")
    revalidatePath("/budgets")

    return {
      ...budget,
      _id: result.insertedId.toString(),
    } as Budget
  } catch (error) {
    console.error("Failed to create budget:", error)
    throw new Error("Failed to create budget")
  }
}

export async function updateBudget(data: Budget): Promise<Budget> {
  try {
    const { _id, ...updateData } = data
    const client = await clientPromise
    const db = client.db(DB_NAME)

    // Check if a budget for this category already exists (excluding the current one)
    const existingBudget = await db.collection(COLLECTION_NAME).findOne({
      categoryId: data.categoryId,
      _id: { $ne: new ObjectId(_id) },
    })

    if (existingBudget) {
      throw new Error("A budget for this category already exists")
    }

    const now = new Date()
    const budget = {
      ...updateData,
      updatedAt: now,
    }

    await db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(_id) }, { $set: budget })

    revalidatePath("/")
    revalidatePath("/budgets")
    revalidatePath(`/budgets/${_id}`)

    return {
      ...budget,
      _id,
    } as Budget
  } catch (error) {
    console.error(`Failed to update budget with ID ${data._id}:`, error)
    throw new Error(`Failed to update budget with ID ${data._id}`)
  }
}

export async function deleteBudget(id: string): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)

    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/")
    revalidatePath("/budgets")
  } catch (error) {
    console.error(`Failed to delete budget with ID ${id}:`, error)
    throw new Error(`Failed to delete budget with ID ${id}`)
  }
}

