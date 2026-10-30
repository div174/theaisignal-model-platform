import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const modelFilter = searchParams.get("model");
    const query = searchParams.get("q");

    const whereClause: {
      modelId?: string;
      OR?: Array<{ prompt?: { contains: string }; response?: { contains: string } }>;
    } = {};

    if (modelFilter && modelFilter !== "all") {
      whereClause.modelId = modelFilter;
    }

    if (query && query.trim()) {
      whereClause.OR = [
        { prompt: { contains: query } },
        { response: { contains: query } },
      ];
    }

    const records = await db.requestHistory.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 100, // Return up to 100 recent entries
    });

    return NextResponse.json({
      success: true,
      history: records,
      total: records.length,
    });
  } catch (err: unknown) {
    console.error("Failed to query history records:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve history logs from the database.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      await db.requestHistory.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, message: "Record deleted." });
    } else {
      // Clear all history
      await db.requestHistory.deleteMany();
      return NextResponse.json({ success: true, message: "All history cleared." });
    }
  } catch (err: unknown) {
    console.error("Failed to delete history record:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete record." },
      { status: 500 }
    );
  }
}
