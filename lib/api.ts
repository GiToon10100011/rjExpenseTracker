import type { Expense } from "./types"

const API_BASE = "/api/expenses"

export async function fetchExpenses(): Promise<Expense[]> {
  const response = await fetch(API_BASE)
  if (!response.ok) {
    throw new Error("Failed to fetch expenses")
  }
  const data = await response.json()
  return data.expenses
}

export async function createExpense(
  expense: Omit<Expense, "id">
): Promise<Expense> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...expense,
      id: Date.now().toString(),
    }),
  })
  if (!response.ok) {
    throw new Error("Failed to create expense")
  }
  const data = await response.json()
  return data.expense
}

export async function updateExpense(
  id: string,
  updates: Partial<Expense>
): Promise<Expense> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.error || "Failed to update expense"
    console.error("Update error:", errorMessage, response.status)
    throw new Error(errorMessage)
  }
  const data = await response.json()
  return data.expense
}

export async function deleteExpense(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.error || "Failed to delete expense"
    console.error("Delete error:", errorMessage, response.status)
    throw new Error(errorMessage)
  }
}

export async function toggleExpensePaid(id: string): Promise<Expense> {
  const response = await fetch(`${API_BASE}/${id}/toggle`, {
    method: "POST",
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.error || "Failed to toggle expense paid status"
    console.error("Toggle error:", errorMessage, response.status)
    throw new Error(errorMessage)
  }
  const data = await response.json()
  return data.expense
}
