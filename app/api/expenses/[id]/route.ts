import { NextRequest, NextResponse } from "next/server";
import { getExpenseById, updateExpense, deleteExpense } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("GET /api/expenses/[id] - id:", id);

    const expense = await getExpenseById(id);
    if (!expense) {
      console.log("Expense not found:", id);
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ expense });
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      {
        error: `Failed to fetch expense: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("PUT /api/expenses/[id] - id:", id);

    const body = await request.json();
    const updated = await updateExpense(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ expense: updated });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      {
        error: `Failed to update expense: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("DELETE /api/expenses/[id] - id:", id);

    const deleted = await deleteExpense(id);
    if (!deleted) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      {
        error: `Failed to delete expense: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}
