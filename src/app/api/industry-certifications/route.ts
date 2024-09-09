import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const collegeId = url.searchParams.get("collegeId");
  try {
    const where: Prisma.ViewCPLCommonQualificationsWhereInput = {};
    if (collegeId) {
      where.CollegeID = parseInt(collegeId);
    }
    const industries = await db.viewCPLCommonQualifications.findMany({
      where,
      orderBy: { IndustryCertification: "asc" },
    });
    if (industries.length === 0) {
      return new NextResponse(null, {
        status: 404,
        statusText: "No articulations found",
      });
    } else {
      return NextResponse.json(industries);
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  return new NextResponse(null, {
    status: 500,
    statusText: "Unexpected server error",
  });
}
