"use client"

import { useExpenses } from "@/lib/expense-context"
import { t } from "@/lib/i18n"
import { convertCurrency, formatCurrency } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Scale, ArrowLeftRight } from "lucide-react"
import { useMemo } from "react"

export function ExpenseSummary() {
  const { expenses, locale, displayCurrency, balanceView, setBalanceView } = useExpenses()

  const summary = useMemo(() => {
    let ronPaidTotal = 0
    let jinPaidTotal = 0

    expenses.forEach((expense) => {
      const converted = convertCurrency(
        expense.amount,
        expense.currency,
        displayCurrency
      )
      if (expense.paidBy === "Rong") {
        ronPaidTotal += converted
      } else {
        jinPaidTotal += converted
      }
    })

    const totalExpenses = ronPaidTotal + jinPaidTotal
    const ronHalfShare = totalExpenses / 2
    const jinHalfShare = totalExpenses / 2

    // Net: positive means Rong owes Jinu, negative means Jinu owes Rong
    const netBalance = ronHalfShare - ronPaidTotal

    return {
      ronPaidTotal,
      jinPaidTotal,
      totalExpenses,
      netBalance,
    }
  }, [expenses, displayCurrency])

  const balanceInfo = useMemo(() => {
    if (Math.abs(summary.netBalance) < 1) {
      return {
        label: t(locale, "settled"),
        amount: 0,
        showAmount: false,
      }
    }

    // Show from selected person's perspective
    // netBalance > 0 means Rong owes Jinu
    // netBalance < 0 means Jinu owes Rong
    
    if (balanceView === "Rong") {
      // From Rong's perspective
      if (summary.netBalance > 0) {
        // Rong owes Jinu - Rong should pay
        return {
          label: t(locale, "rongShouldPay"),
          amount: summary.netBalance,
          showAmount: true,
        }
      } else {
        // Jinu owes Rong - Jinu should pay
        return {
          label: t(locale, "jinuShouldPay"),
          amount: Math.abs(summary.netBalance),
          showAmount: true,
        }
      }
    } else {
      // From Jinu's perspective
      if (summary.netBalance < 0) {
        // Jinu owes Rong - Jinu should pay
        return {
          label: t(locale, "jinuShouldPay"),
          amount: Math.abs(summary.netBalance),
          showAmount: true,
        }
      } else {
        // Rong owes Jinu - Rong should pay
        return {
          label: t(locale, "rongShouldPay"),
          amount: summary.netBalance,
          showAmount: true,
        }
      }
    }
  }, [summary.netBalance, locale, balanceView])

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-foreground">
        {t(locale, "summary")}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Rong's Total */}
        <Card className="border-border bg-card shadow-none">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chart-2/15">
              <ArrowUpRight className="h-5 w-5 text-chart-2" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {"Rong"} - {t(locale, "youPaid")}
              </p>
              <p className="truncate text-lg font-bold text-foreground">
                {formatCurrency(summary.ronPaidTotal, displayCurrency)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Jinu's Total */}
        <Card className="border-border bg-card shadow-none">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chart-1/15">
              <ArrowDownRight className="h-5 w-5 text-chart-1" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {"Jinu"} - {t(locale, "youPaid")}
              </p>
              <p className="truncate text-lg font-bold text-foreground">
                {formatCurrency(summary.jinPaidTotal, displayCurrency)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Net Balance with Toggle Button */}
        <Card className={`shadow-none ${
          Math.abs(summary.netBalance) < 1
            ? "border-border bg-card"
            : "border-primary/20 bg-primary/5"
        }`}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{balanceInfo.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-foreground">
                  {balanceInfo.showAmount
                    ? formatCurrency(balanceInfo.amount, displayCurrency)
                    : "---"}
                </p>
                {/* Toggle Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const newView = balanceView === "Rong" ? "Jinu" : "Rong"
                    setBalanceView(newView)
                  }}
                  aria-label={t(locale, "balanceView")}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
