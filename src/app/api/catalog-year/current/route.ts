import { NextResponse } from "next/server";
import { db } from "../../../../../prisma/db";

export async function GET() {
  try {
    const currentDate = new Date();

    const currentCatalogYear = await db.lookupCatalogYear.findFirst({
      where: {
        AND: [
          {
            StartDate: {
              lte: currentDate,
            },
          },
          {
            EndDate: {
              gte: currentDate,
            },
          },
        ],
      },
      orderBy: {
        StartDate: "desc",
      },
    });

    if (!currentCatalogYear) {
      return NextResponse.json(
        { error: "No active catalog year found" },
        { status: 404 }
      );
    }

    return NextResponse.json(currentCatalogYear);
  } catch (error) {
    console.error("Failed to fetch current catalog year:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch current catalog year",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
