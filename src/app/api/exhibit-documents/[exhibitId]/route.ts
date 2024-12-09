import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { exhibitId: string } }
) {
  try {
    const exhibitDocuments = await prisma.cPLExhibitDocuments.findMany({
      where: {
        CPLExhibitID: parseInt(params.exhibitId),
      },
    });
    return NextResponse.json(exhibitDocuments);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch exhibit documents" },
      { status: 500 }
    );
  }
}
