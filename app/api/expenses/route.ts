import { NextRequest, NextResponse } from "next/server"
import {
  getAllExpenses,
  insertExpense,
  updateExpense,
  deleteExpense,
  toggleExpensePaid,
} from "@/lib/db"
import type { Expense } from "@/lib/types"

export async function GET() {
  try {
    const expenses = await getAllExpenses()
    return NextResponse.json({ expenses })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const expense: Expense = {
      id: body.id || Date.now().toString(),
      description: body.description,
      amount: body.amount,
      currency: body.currency,
      paidBy: body.paidBy,
      category: body.category,
      date: body.date,
      isPaid: body.isPaid || false,
    }

    const created = await insertExpense(expense)
    return NextResponse.json({ expense: created }, { status: 201 })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      )
    }

    const updated = await updateExpense(id, updates)
    if (!updated) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ expense: updated })
  } catch (error) {
    console.error("Error updating expense:", error)
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      )
    }

    const deleted = await deleteExpense(id)
    if (!deleted) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    )
  }
}