"use client"

import { useState, useMemo } from "react"
import { useExpenses } from "@/lib/expense-context"
import { t } from "@/lib/i18n"
import {
  convertCurrency,
  formatCurrency,
  currencySymbols,
  type Currency,
} from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight } from "lucide-react"

export function ExchangeRatePanel() {
  const { locale } = useExpenses()
  const [fromCurrency, setFromCurrency] = useState<Currency>("YEN")
  const [toCurrency, setToCurrency] = useState<Currency>("WON")
  const [inputAmount, setInputAmount] = useState("1000")

  const convertedAmount = useMemo(() => {
    const num = parseFloat(inputAmount) || 0
    return convertCurrency(num, fromCurrency, toCurrency)
  }, [inputAmount, fromCurrency, toCurrency])

  const rate = useMemo(() => {
    return convertCurrency(1, fromCurrency, toCurrency)
  }, [fromCurrency, toCurrency])

  const currencies: Currency[] = ["YEN", "TWD", "WON"]

  return (
    <Card className="border-border bg-card shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground">
          {t(locale, "exchangeRate")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Rate Display */}
        <div className="rounded-lg bg-secondary px-3 py-2 text-center">
          <span className="text-xs text-muted-foreground">
            1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
          </span>
        </div>

        {/* Converter */}
        <div className="flex items-end gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <Input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              min="0"
              className="border-input bg-background text-right text-sm font-medium text-foreground"
            />
            <Select
              value={fromCurrency}
              onValueChange={(v) => setFromCurrency(v as Currency)}
            >
              <SelectTrigger className="h-8 border-input bg-background text-xs text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c} value={c}>
                    {currencySymbols[c]} {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <div className="flex h-9 items-center justify-end rounded-md bg-secondary px-3 text-sm font-bold text-foreground">
              {formatCurrency(convertedAmount, toCurrency)}
            </div>
            <Select
              value={toCurrency}
              onValueChange={(v) => setToCurrency(v as Currency)}
            >
              <SelectTrigger className="h-8 border-input bg-background text-xs text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c} value={c}>
                    {currencySymbols[c]} {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-1 flex flex-col gap-1.5">
          {currencies
            .filter((c) => c !== fromCurrency)
            .map((c) => (
              <div
                key={c}
                className="flex items-center justify-between text-xs text-muted-foreground"
              >
                <span>
                  {currencySymbols[fromCurrency]}1,000
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(convertCurrency(1000, fromCurrency, c), c)}
                </span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
