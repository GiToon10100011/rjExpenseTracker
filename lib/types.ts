export type Currency = "TWD" | "WON" | "YEN"
export type User = "Ron" | "Jin"
export type Category = "food" | "utilities" | "rent" | "transport" | "entertainment" | "other"

export interface Expense {
  id: string
  description: string
  amount: number
  currency: Currency
  paidBy: User
  category: Category
  date: string
  isPaid: boolean
}

export const currencySymbols: Record<Currency, string> = {
  TWD: "NT$",
  WON: "₩",
  YEN: "¥",
}

export const currencyLabels: Record<Currency, string> = {
  TWD: "TWD (台湾ドル)",
  WON: "KRW (韓国ウォン)",
  YEN: "JPY (日本円)",
}

// Static exchange rates (approximate)
// Base: 1 YEN
export const exchangeRates: Record<Currency, Record<Currency, number>> = {
  YEN: {
    YEN: 1,
    TWD: 0.22,
    WON: 9.2,
  },
  TWD: {
    TWD: 1,
    YEN: 4.55,
    WON: 41.8,
  },
  WON: {
    WON: 1,
    YEN: 0.109,
    TWD: 0.024,
  },
}

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount
  return amount * exchangeRates[from][to]
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = currencySymbols[currency]
  const rounded = Math.round(amount)
  return `${symbol}${rounded.toLocaleString()}`
}
