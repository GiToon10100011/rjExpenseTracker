"use client"

import { useExpenses } from "@/lib/expense-context"
import { t } from "@/lib/i18n"
import { convertCurrency, formatCurrency } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Scale } from "lucide-react"
import { useMemo } from "react"

export function ExpenseSummary() {
  const { expenses, locale, displayCurrency } = useExpenses()

  const summary = useMemo(() => {
    let ronPaidTotal = 0
    let jinPaidTotal = 0

    expenses.forEach((expense) => {
      const converted = convertCurrency(
        expense.amount,
        expense.currency,
        displayCurrency
      )
      if (expense.paidBy === "Ron") {
        ronPaidTotal += converted
      } else {
        jinPaidTotal += converted
      }
    })

    const totalExpenses = ronPaidTotal + jinPaidTotal
    const ronHalfShare = totalExpenses / 2
    const jinHalfShare = totalExpenses / 2

    // Net: positive means Ron owes Jin, negative means Jin owes Ron
    const netBalance = ronHalfShare - ronPaidTotal

    return {
      ronPaidTotal,
      jinPaidTotal,
      totalExpenses,
      netBalance,
    }
  }, [expenses, displayCurrency])

  const balanceLabel = useMemo(() => {
    if (Math.abs(summary.netBalance) < 1) return t(locale, "settled")
    if (summary.netBalance > 0) return t(locale, "ronOwesJin")
    return t(locale, "jinOwesRon")
  }, [summary.netBalance, locale])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* Ron's Total */}
      <Card className="border-border bg-card shadow-none">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chart-2/15">
            <ArrowUpRight className="h-5 w-5 text-chart-2" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              {"Ron"} - {t(locale, "youPaid")}
            </p>
            <p className="truncate text-lg font-bold text-foreground">
              {formatCurrency(summary.ronPaidTotal, displayCurrency)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Jin's Total */}
      <Card className="border-border bg-card shadow-none">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chart-1/15">
            <ArrowDownRight className="h-5 w-5 text-chart-1" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              {"Jin"} - {t(locale, "youPaid")}
            </p>
            <p className="truncate text-lg font-bold text-foreground">
              {formatCurrency(summary.jinPaidTotal, displayCurrency)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Net Balance */}
      <Card className={`shadow-none ${
        Math.abs(summary.netBalance) < 1
          ? "border-border bg-card"
          : "border-primary/20 bg-primary/5"
      }`}>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{balanceLabel}</p>
            <p className="truncate text-lg font-bold text-foreground">
              {Math.abs(summary.netBalance) < 1
                ? "---"
                : formatCurrency(Math.abs(summary.netBalance), displayCurrency)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
