"use client"

import { ExpenseProvider } from "@/lib/expense-context"
import { ExpenseHeader } from "@/components/expense-header"
import { ExpenseSummary } from "@/components/expense-summary"
import { ExpenseList } from "@/components/expense-list"
import { ExchangeRatePanel } from "@/components/exchange-rate-panel"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { useExpenses } from "@/lib/expense-context"
import { t } from "@/lib/i18n"

function ExpenseApp() {
  const { locale } = useExpenses()

  return (
    <div className="min-h-screen bg-background">
      <ExpenseHeader />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6">
          {/* Summary Cards */}
          <ExpenseSummary />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Expense List - 2 columns */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">
                  {t(locale, "expenses")}
                </h2>
                <AddExpenseDialog />
              </div>
              <ExpenseList />
            </div>

            {/* Sidebar - Exchange rates */}
            <div className="flex flex-col gap-4">
              <ExchangeRatePanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <ExpenseProvider>
      <ExpenseApp />
    </ExpenseProvider>
  )
}
