import { NextRequest, NextResponse } from "next/server";
import { toggleExpensePaid } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("POST /api/expenses/[id]/toggle - id:", id);

    const updated = await toggleExpensePaid(id);
    if (!updated) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ expense: updated });
  } catch (error) {
    console.error("Error toggling expense paid status:", error);
    return NextResponse.json(
      {
        error: `Failed to toggle expense paid status: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}
