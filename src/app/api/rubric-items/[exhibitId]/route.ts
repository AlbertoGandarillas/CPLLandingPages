import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { exhibitId: string } }
) {
  try {
    const rubricItems = await prisma.cPLRubric.findMany({
      where: {
        ExhibitID: parseInt(params.exhibitId),
      },
    });
    return NextResponse.json(rubricItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch rubric items" },
      { status: 500 }
    );
  }
}
