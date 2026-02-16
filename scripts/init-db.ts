/**
 * Database initialization script
 * Run this to initialize the database with sample data
 * Usage: npx tsx scripts/init-db.ts
 */

import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import type { Expense } from "../lib/types"

const dbPath = path.join(process.cwd(), "data", "expenses.db")
const dbDir = path.dirname(dbPath)

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)
db.pragma("foreign_keys = ON")

// Create table
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

// Check if database is empty
const count = db.prepare("SELECT COUNT(*) as count FROM expenses").get() as {
  count: number
}

if (count.count === 0) {
  console.log("Database is empty. Inserting sample data...")

  const sampleExpenses: Expense[] = [
    {
      id: "1",
      description: "スーパーで買い物",
      amount: 3500,
      currency: "YEN",
      paidBy: "Rong",
      category: "food",
      date: "2026-02-10",
      isPaid: false,
    },
    {
      id: "2",
      description: "전기요금",
      amount: 45000,
      currency: "WON",
      paidBy: "Jinu",
      category: "utilities",
      date: "2026-02-08",
      isPaid: true,
    },
    {
      id: "3",
      description: "晩ご飯 - レストラン",
      amount: 8200,
      currency: "YEN",
      paidBy: "Jinu",
      category: "food",
      date: "2026-02-12",
      isPaid: false,
    },
    {
      id: "4",
      description: "交通カード チャージ",
      amount: 500,
      currency: "TWD",
      paidBy: "Rong",
      category: "transport",
      date: "2026-02-14",
      isPaid: false,
    },
    {
      id: "5",
      description: "Netflix 月額",
      amount: 15000,
      currency: "WON",
      paidBy: "Jinu",
      category: "entertainment",
      date: "2026-02-01",
      isPaid: true,
    },
  ]

  const insert = db.prepare(`
    INSERT INTO expenses (id, description, amount, currency, paidBy, category, date, isPaid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertMany = db.transaction((expenses: Expense[]) => {
    for (const expense of expenses) {
      insert.run(
        expense.id,
        expense.description,
        expense.amount,
        expense.currency,
        expense.paidBy,
        expense.category,
        expense.date,
        expense.isPaid ? 1 : 0
      )
    }
  })

  insertMany(sampleExpenses)
  console.log(`Inserted ${sampleExpenses.length} sample expenses.`)
} else {
  console.log(`Database already has ${count.count} expenses.`)
}

db.close()
console.log("Database initialization complete!")
