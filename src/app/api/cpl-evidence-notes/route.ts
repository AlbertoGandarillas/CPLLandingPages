import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";

export const dynamic = "force-dynamic"; // Makes the route dynamic

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const type = searchParams.get("type");      


    if (!title) {
      return NextResponse.json(
        { error: "Title parameter is required" },
        { status: 400 }
      );
    }

    const evidenceNotes = await db.viewCPLEvidenceCompetencyNotes.findMany({
      where: {
        title: {
          equals: title,
        },
        Type: {
          equals: type || undefined,
        },
      },
    });

    return NextResponse.json(evidenceNotes);
  } catch (error) {
    console.error("Error fetching evidence notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch evidence notes" },
      { status: 500 }
    );
  }
}
