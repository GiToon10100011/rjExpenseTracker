"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Expense, Currency, User, Category } from "@/lib/types"
import type { Locale } from "@/lib/i18n"

interface ExpenseContextType {
  expenses: Expense[]
  locale: Locale
  displayCurrency: Currency
  filter: "all" | "paid" | "unpaid"
  balanceView: "Rong" | "Jinu"
  setLocale: (locale: Locale) => void
  setDisplayCurrency: (currency: Currency) => void
  setFilter: (filter: "all" | "paid" | "unpaid") => void
  setBalanceView: (view: "Rong" | "Jinu") => void
  addExpense: (expense: Omit<Expense, "id">) => void
  removeExpense: (id: string) => void
  togglePaid: (id: string) => void
  updateExpense: (id: string, updates: Partial<Expense>) => void
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

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

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses)
  const [locale, setLocale] = useState<Locale>("ja")
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("YEN")
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid">("all")
  const [balanceView, setBalanceView] = useState<"Rong" | "Jinu">("Rong")

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
  }, [])

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const togglePaid = useCallback((id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isPaid: !e.isPaid } : e))
    )
  }, [])

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    )
  }, [])

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        locale,
        displayCurrency,
        filter,
        balanceView,
        setLocale,
        setDisplayCurrency,
        setFilter,
        setBalanceView,
        addExpense,
        removeExpense,
        togglePaid,
        updateExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider")
  }
  return context
}
