import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { exhibitId: string } }
) {
  try {
    const evidenceCompetencies = await prisma.cPLEvidenceCompetency.findMany({
      where: {
        ExhibitID: parseInt(params.exhibitId),
      },
      include: {
        CompetencyType: true,
      },
    });
    return NextResponse.json(evidenceCompetencies);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch evidence competencies" },
      { status: 500 }
    );
  }
}
