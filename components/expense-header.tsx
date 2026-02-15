"use client"

import { useExpenses } from "@/lib/expense-context"
import { t, localeNames, type Locale } from "@/lib/i18n"
import type { Currency } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Globe, ArrowLeftRight } from "lucide-react"

export function ExpenseHeader() {
  const { locale, setLocale, displayCurrency, setDisplayCurrency } = useExpenses()

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">R&J</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {t(locale, "appTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(locale, "appSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            <Select
              value={displayCurrency}
              onValueChange={(v) => setDisplayCurrency(v as Currency)}
            >
              <SelectTrigger className="h-7 w-[90px] border-0 bg-transparent p-0 text-sm font-medium text-foreground shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YEN">JPY (¥)</SelectItem>
                <SelectItem value="TWD">TWD (NT$)</SelectItem>
                <SelectItem value="WON">KRW (₩)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select
              value={locale}
              onValueChange={(v) => setLocale(v as Locale)}
            >
              <SelectTrigger className="h-7 w-[90px] border-0 bg-transparent p-0 text-sm font-medium text-foreground shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(localeNames) as [Locale, string][]).map(
                  ([key, name]) => (
                    <SelectItem key={key} value={key}>
                      {name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  )
}
