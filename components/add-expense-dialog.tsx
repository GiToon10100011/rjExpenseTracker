"use client"

import { useState } from "react"
import { useExpenses } from "@/lib/expense-context"
import { t } from "@/lib/i18n"
import type { Currency, User, Category } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Utensils, Zap, Home, Train, Clapperboard, MoreHorizontal } from "lucide-react"

const categoryIcons: Record<Category, React.ReactNode> = {
  food: <Utensils className="h-4 w-4" />,
  utilities: <Zap className="h-4 w-4" />,
  rent: <Home className="h-4 w-4" />,
  transport: <Train className="h-4 w-4" />,
  entertainment: <Clapperboard className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
}

export function AddExpenseDialog() {
  const { locale, addExpense } = useExpenses()
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<Currency>("YEN")
  const [paidBy, setPaidBy] = useState<User>("Ron")
  const [category, setCategory] = useState<Category>("food")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = () => {
    if (!description.trim() || !amount || parseFloat(amount) <= 0) return

    addExpense({
      description: description.trim(),
      amount: parseFloat(amount),
      currency,
      paidBy,
      category,
      date,
      isPaid: false,
    })

    setDescription("")
    setAmount("")
    setCurrency("YEN")
    setPaidBy("Ron")
    setCategory("food")
    setDate(new Date().toISOString().split("T")[0])
    setOpen(false)
  }

  const categories: Category[] = ["food", "utilities", "rent", "transport", "entertainment", "other"]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          {t(locale, "addExpense")}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t(locale, "addExpense")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground">
              {t(locale, "description")}
            </Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t(locale, "descriptionPlaceholder")}
              className="border-input bg-background text-foreground"
            />
          </div>

          {/* Amount + Currency */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground">
                {t(locale, "amount")}
              </Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t(locale, "amountPlaceholder")}
                min="0"
                step="1"
                className="border-input bg-background text-foreground"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground">
                {t(locale, "currency")}
              </Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger className="border-input bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YEN">¥ JPY</SelectItem>
                  <SelectItem value="TWD">NT$ TWD</SelectItem>
                  <SelectItem value="WON">₩ KRW</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Paid By + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground">
                {t(locale, "paidBy")}
              </Label>
              <Select value={paidBy} onValueChange={(v) => setPaidBy(v as User)}>
                <SelectTrigger className="border-input bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ron">Ron</SelectItem>
                  <SelectItem value="Jin">Jin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground">
                {t(locale, "category")}
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="border-input bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <span className="flex items-center gap-2">
                        {categoryIcons[cat]}
                        {t(locale, cat)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground">
              {t(locale, "date")}
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-input bg-background text-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border text-foreground"
            >
              {t(locale, "cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!description.trim() || !amount || parseFloat(amount) <= 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t(locale, "add")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
