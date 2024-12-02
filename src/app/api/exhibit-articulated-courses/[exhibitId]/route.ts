import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { exhibitId: string } }
) {
  try {
    const exhibitCourses = await prisma.viewCPLExhibitCourses.findMany({
      where: {
        ExhibitID: parseInt(params.exhibitId),
      },
    });
    return NextResponse.json(exhibitCourses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch exhibit articulated courses" },
      { status: 500 }
    );
  }
}
