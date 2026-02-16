"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { Expense, Currency, User, Category } from "@/lib/types"
import type { Locale } from "@/lib/i18n"
import {
  fetchExpenses,
  createExpense as apiCreateExpense,
  updateExpense as apiUpdateExpense,
  deleteExpense as apiDeleteExpense,
  toggleExpensePaid as apiToggleExpensePaid,
} from "@/lib/api"

interface ExpenseContextType {
  expenses: Expense[]
  isLoading: boolean
  locale: Locale
  displayCurrency: Currency
  filter: "all" | "paid" | "unpaid"
  balanceView: "Rong" | "Jinu"
  setLocale: (locale: Locale) => void
  setDisplayCurrency: (currency: Currency) => void
  setFilter: (filter: "all" | "paid" | "unpaid") => void
  setBalanceView: (view: "Rong" | "Jinu") => void
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>
  removeExpense: (id: string) => Promise<void>
  togglePaid: (id: string) => Promise<void>
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>
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
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [locale, setLocale] = useState<Locale>("ja")
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("YEN")
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid">("all")
  const [balanceView, setBalanceView] = useState<"Rong" | "Jinu">("Rong")

  // Load expenses on mount
  useEffect(() => {
    async function loadExpenses() {
      try {
        const data = await fetchExpenses()
        setExpenses(data)
      } catch (error) {
        console.error("Failed to load expenses:", error)
        // Fallback to sample data if API fails
        setExpenses(sampleExpenses)
      } finally {
        setIsLoading(false)
      }
    }
    loadExpenses()
  }, [])

  const addExpense = useCallback(async (expense: Omit<Expense, "id">) => {
    try {
      const newExpense = await apiCreateExpense(expense)
      setExpenses((prev) => [newExpense, ...prev])
    } catch (error) {
      console.error("Failed to add expense:", error)
      throw error
    }
  }, [])

  const removeExpense = useCallback(async (id: string) => {
    try {
      await apiDeleteExpense(id)
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Failed to remove expense:", error)
      throw error
    }
  }, [])

  const togglePaid = useCallback(async (id: string) => {
    try {
      const updated = await apiToggleExpensePaid(id)
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? updated : e))
      )
    } catch (error) {
      console.error("Failed to toggle expense paid status:", error)
      throw error
    }
  }, [])

  const updateExpense = useCallback(
    async (id: string, updates: Partial<Expense>) => {
      try {
        const updated = await apiUpdateExpense(id, updates)
        setExpenses((prev) =>
          prev.map((e) => (e.id === id ? updated : e))
        )
      } catch (error) {
        console.error("Failed to update expense:", error)
        throw error
      }
    },
    []
  )

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        isLoading,
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
