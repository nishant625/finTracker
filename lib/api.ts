// API client functions for making requests to the backend

// Transactions
export async function getTransactions() {
  const res = await fetch("/api/transactions", {
    next: { revalidate: 0 }, // Don't cache this data
  })

  if (!res.ok) {
    throw new Error("Failed to fetch transactions")
  }

  return res.json()
}

export async function getTransaction(query: string = "") {
  const url = query ? `/api/transactions?${query}` : `/api/transactions` // ✅ Correct concatenation

  const res = await fetch(url, {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch transactions: ${res.status} ${res.statusText}`)
  }

  return res.json()
}




export async function createTransaction(data: any) {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to create transaction")
  }

  return res.json()
}

export async function updateTransaction(id: string, data: any) {
  const res = await fetch(`/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to update transaction")
  }

  return res.json()
}

export async function deleteTransaction(id: string) {
  const res = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete transaction")
  }

  return res.json()
}

// Categories
export async function getCategories() {
  const res = await fetch("/api/categories", {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch categories")
  }

  return res.json()
}

export async function getCategory(id: string) {
  const res = await fetch(`/api/categories/${id}`, {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch category")
  }

  return res.json()
}

export async function createCategory(data: any) {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to create category")
  }

  return res.json()
}

export async function updateCategory(id: string, data: any) {
  const res = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to update category")
  }

  return res.json()
}

export async function deleteCategory(id: string) {
  const res = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete category")
  }

  return res.json()
}

// Budgets
export async function getBudgets() {
  const res = await fetch("/api/budgets", {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch budgets")
  }

  return res.json()
}

export async function getBudget(id: string) {
  const res = await fetch(`/api/budgets/${id}`, {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch budget")
  }

  return res.json()
}

export async function createBudget(data: any) {
  const res = await fetch("/api/budgets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to create budget")
  }

  return res.json()
}

export async function updateBudget(id: string, data: any) {
  const res = await fetch(`/api/budgets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to update budget")
  }

  return res.json()
}

export async function deleteBudget(id: string) {
  const res = await fetch(`/api/budgets/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete budget")
  }

  return res.json()
}

// Dashboard
export async function getDashboardData() {
  const res = await fetch("/api/dashboard", {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data")
  }

  return res.json()
}

// Seed data
export async function seedDatabase() {
  const res = await fetch("/api/seed")

  if (!res.ok) {
    throw new Error("Failed to seed database")
  }

  return res.json()
}

