"use server"

import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/db"
import type { Transaction } from "@/lib/types"

const DB_NAME = "finance_tracker"
const COLLECTION_NAME = "transactions"

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const transactions = await db.collection(COLLECTION_NAME).find({}).sort({ date: -1 }).toArray()

    return transactions.map((transaction) => ({
      ...transaction,
      _id: transaction._id.toString(),
    })) as Transaction[]
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    throw new Error("Failed to fetch transactions")
  }
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const transaction = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) })

    if (!transaction) return null

    return {
      ...transaction,
      _id: transaction._id.toString(),
    } as Transaction
  } catch (error) {
    console.error(`Failed to fetch transaction with ID ${id}:`, error)
    throw new Error(`Failed to fetch transaction with ID ${id}`)
  }
}

export async function createTransaction(data: Omit<Transaction, "_id">): Promise<Transaction> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)

    const now = new Date()
    const transaction = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(COLLECTION_NAME).insertOne(transaction)

    revalidatePath("/")
    revalidatePath("/transactions")
    revalidatePath("/budgets")

    return {
      ...transaction,
      _id: result.insertedId.toString(),
    } as Transaction
  } catch (error) {
    console.error("Failed to create transaction:", error)
    throw new Error("Failed to create transaction")
  }
}

export async function updateTransaction(data: Transaction): Promise<Transaction> {
  try {
    const { _id, ...updateData } = data
    const client = await clientPromise
    const db = client.db(DB_NAME)

    const now = new Date()
    const transaction = {
      ...updateData,
      updatedAt: now,
    }

    await db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(_id) }, { $set: transaction })

    revalidatePath("/")
    revalidatePath("/transactions")
    revalidatePath(`/transactions/${_id}`)
    revalidatePath("/budgets")

    return {
      ...transaction,
      _id,
    } as Transaction
  } catch (error) {
    console.error(`Failed to update transaction with ID ${data._id}:`, error)
    throw new Error(`Failed to update transaction with ID ${data._id}`)
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)

    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/")
    revalidatePath("/transactions")
    revalidatePath("/budgets")
  } catch (error) {
    console.error(`Failed to delete transaction with ID ${id}:`, error)
    throw new Error(`Failed to delete transaction with ID ${id}`)
  }
}

