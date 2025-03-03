export interface Transaction {
  _id: string
  description: string
  amount: number
  date: string | Date
  categoryId: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  _id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface Budget {
  _id: string
  categoryId: string
  amount: number
  createdAt?: string
  updatedAt?: string
}

