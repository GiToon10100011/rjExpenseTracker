import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import type { Expense } from "./types"

const dbPath = path.join(process.cwd(), "data", "expenses.db")
const dbDir = path.dirname(dbPath)

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Initialize database
const db = new Database(dbPath)

// Enable foreign keys
db.pragma("foreign_keys = ON")

// Create expenses table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL CHECK(currency IN ('TWD', 'WON', 'YEN')),
    paidBy TEXT NOT NULL CHECK(paidBy IN ('Rong', 'Jinu')),
    category TEXT NOT NULL CHECK(category IN ('food', 'utilities', 'rent', 'transport', 'entertainment', 'other')),
    date TEXT NOT NULL,
    isPaid INTEGER NOT NULL DEFAULT 0 CHECK(isPaid IN (0, 1)),
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

// Create indexes
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
  CREATE INDEX IF NOT EXISTS idx_expenses_paidBy ON expenses(paidBy);
  CREATE INDEX IF NOT EXISTS idx_expenses_isPaid ON expenses(isPaid);
`)

// Prepared statements
export const dbQueries = {
  getAll: db.prepare("SELECT * FROM expenses ORDER BY date DESC, createdAt DESC"),
  getById: db.prepare("SELECT * FROM expenses WHERE id = ?"),
  insert: db.prepare(`
    INSERT INTO expenses (id, description, amount, currency, paidBy, category, date, isPaid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE expenses 
    SET description = ?, amount = ?, currency = ?, paidBy = ?, category = ?, date = ?, isPaid = ?, updatedAt = datetime('now')
    WHERE id = ?
  `),
  delete: db.prepare("DELETE FROM expenses WHERE id = ?"),
  togglePaid: db.prepare(`
    UPDATE expenses 
    SET isPaid = NOT isPaid, updatedAt = datetime('now')
    WHERE id = ?
  `),
}

// Helper functions
export function getAllExpenses(): Expense[] {
  const rows = dbQueries.getAll.all() as any[]
  return rows.map((row) => ({
    id: row.id,
    description: row.description,
    amount: row.amount,
    currency: row.currency as Expense["currency"],
    paidBy: row.paidBy as Expense["paidBy"],
    category: row.category as Expense["category"],
    date: row.date,
    isPaid: Boolean(row.isPaid),
  }))
}

export function getExpenseById(id: string): Expense | null {
  const row = dbQueries.getById.get(id) as any
  if (!row) return null
  return {
    id: row.id,
    description: row.description,
    amount: row.amount,
    currency: row.currency as Expense["currency"],
    paidBy: row.paidBy as Expense["paidBy"],
    category: row.category as Expense["category"],
    date: row.date,
    isPaid: Boolean(row.isPaid),
  }
}

export function insertExpense(expense: Expense): Expense {
  dbQueries.insert.run(
    expense.id,
    expense.description,
    expense.amount,
    expense.currency,
    expense.paidBy,
    expense.category,
    expense.date,
    expense.isPaid ? 1 : 0
  )
  return expense
}

export function updateExpense(id: string, updates: Partial<Expense>): Expense | null {
  const existing = getExpenseById(id)
  if (!existing) return null

  const updated: Expense = {
    ...existing,
    ...updates,
  }

  dbQueries.update.run(
    updated.description,
    updated.amount,
    updated.currency,
    updated.paidBy,
    updated.category,
    updated.date,
    updated.isPaid ? 1 : 0,
    id
  )

  return updated
}

export function deleteExpense(id: string): boolean {
  const result = dbQueries.delete.run(id)
  return (result.changes as number) > 0
}

export function toggleExpensePaid(id: string): Expense | null {
  const existing = getExpenseById(id)
  if (!existing) return null

  dbQueries.togglePaid.run(id)
  return getExpenseById(id)
}

// Close database on process exit
process.on("exit", () => db.close())
process.on("SIGINT", () => {
  db.close()
  process.exit(0)
})
process.on("SIGTERM", () => {
  db.close()
  process.exit(0)
})

export default db
