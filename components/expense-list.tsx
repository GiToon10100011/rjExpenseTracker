"use client"

import { useMemo } from "react"
import { useExpenses } from "@/lib/expense-context"
import { t } from "@/lib/i18n"
import { convertCurrency, formatCurrency, currencySymbols } from "@/lib/types"
import type { Category } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Utensils,
  Zap,
  Home,
  Train,
  Clapperboard,
  MoreHorizontal,
  Trash2,
  ReceiptText,
} from "lucide-react"

const categoryIcons: Record<Category, React.ReactNode> = {
  food: <Utensils className="h-4 w-4" />,
  utilities: <Zap className="h-4 w-4" />,
  rent: <Home className="h-4 w-4" />,
  transport: <Train className="h-4 w-4" />,
  entertainment: <Clapperboard className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
}

export function ExpenseList() {
  const {
    expenses,
    locale,
    displayCurrency,
    filter,
    setFilter,
    togglePaid,
    removeExpense,
  } = useExpenses()

  const filteredExpenses = useMemo(() => {
    let result = [...expenses]
    if (filter === "paid") result = result.filter((e) => e.isPaid)
    if (filter === "unpaid") result = result.filter((e) => !e.isPaid)
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [expenses, filter])

  const filters = [
    { key: "all" as const, label: t(locale, "filterAll") },
    { key: "unpaid" as const, label: t(locale, "filterUnpaid") },
    { key: "paid" as const, label: t(locale, "filterPaid") },
  ]

  return (
    <div className="flex flex-col gap-3">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Expense Items */}
      {filteredExpenses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-border bg-card px-6 py-12 shadow-none">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <ReceiptText className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">
            {t(locale, "noExpenses")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(locale, "noExpensesDesc")}
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              locale={locale}
              displayCurrency={displayCurrency}
              onTogglePaid={togglePaid}
              onRemove={removeExpense}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ExpenseItem({
  expense,
  locale,
  displayCurrency,
  onTogglePaid,
  onRemove,
}: {
  expense: ReturnType<typeof useExpenses>["expenses"][0]
  locale: ReturnType<typeof useExpenses>["locale"]
  displayCurrency: ReturnType<typeof useExpenses>["displayCurrency"]
  onTogglePaid: (id: string) => Promise<void>
  onRemove: (id: string) => Promise<void>
}) {
  const halfAmount = expense.amount / 2
  const convertedHalf = convertCurrency(halfAmount, expense.currency, displayCurrency)
  const convertedFull = convertCurrency(expense.amount, expense.currency, displayCurrency)
  const isConverted = expense.currency !== displayCurrency

  // For the payer: they paid the full amount, their share is half = net positive of half
  // For the other: they owe half = net negative of half
  const ronAmount =
    expense.paidBy === "Rong" ? +convertedHalf : -convertedHalf
  const jinAmount =
    expense.paidBy === "Jinu" ? +convertedHalf : -convertedHalf

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (locale === "ja") {
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
    if (locale === "ko") {
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <Card
      className={`border-border bg-card shadow-none transition-opacity ${
        expense.isPaid ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <div className="pt-0.5">
          <Checkbox
            checked={expense.isPaid}
            onCheckedChange={async () => {
              try {
                await onTogglePaid(expense.id)
              } catch (error) {
                console.error("Failed to toggle paid status:", error)
              }
            }}
            className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            aria-label={expense.isPaid ? t(locale, "markAsUnpaid") : t(locale, "markAsPaid")}
          />
        </div>

        {/* Category Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          {categoryIcons[expense.category]}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className={`truncate text-sm font-medium ${
                  expense.isPaid
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {expense.description}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatDate(expense.date)}
                </span>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    expense.paidBy === "Rong"
                      ? "bg-chart-2/10 text-chart-2"
                      : "bg-chart-1/10 text-chart-1"
                  }`}
                >
                  {expense.paidBy}
                </Badge>
                {expense.isPaid && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-xs text-primary"
                  >
                    {t(locale, "paid")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Amount Column */}
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-foreground">
                {currencySymbols[expense.currency]}
                {expense.amount.toLocaleString()}
              </p>
              {isConverted && (
                <p className="text-xs text-muted-foreground">
                  {"≈ "}
                  {formatCurrency(convertedFull, displayCurrency)}
                </p>
              )}
            </div>
          </div>

          {/* Split Details */}
          <div className="mt-2 flex items-center justify-between rounded-md bg-secondary/50 px-3 py-1.5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs">
                <span className="font-medium text-foreground">Rong</span>
                <span
                  className={`font-bold ${
                    ronAmount >= 0 ? "text-chart-2" : "text-chart-1"
                  }`}
                >
                  {ronAmount >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(ronAmount), displayCurrency)}
                </span>
              </span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="flex items-center gap-1 text-xs">
                <span className="font-medium text-foreground">Jinu</span>
                <span
                  className={`font-bold ${
                    jinAmount >= 0 ? "text-chart-2" : "text-chart-1"
                  }`}
                >
                  {jinAmount >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(jinAmount), displayCurrency)}
                </span>
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  await onRemove(expense.id)
                } catch (error) {
                  console.error("Failed to remove expense:", error)
                }
              }}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              aria-label={t(locale, "delete")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
