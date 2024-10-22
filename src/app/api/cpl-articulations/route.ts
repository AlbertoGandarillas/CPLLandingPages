import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const college = url.searchParams.get("college");
  const cplType = url.searchParams.get("cplType");
  const learningMode = url.searchParams.get("learningMode");
  try {
    const where: Prisma.ViewCPLArticulationsWhereInput = {};

    if (college) {
      where.CollegeID = parseInt(college);
    }
    if (cplType) {
      where.CPLType = parseInt(cplType);
    }
    if (learningMode) {
      where.ModelOfLearning = parseInt(learningMode);
    }

    const articulations = await db.viewCPLArticulations.findMany({
        where,
        orderBy: [{College:"asc"}, { Subject: "asc" }, { CourseNumber: "asc" }],
    });

    if (articulations.length === 0) {
      return new NextResponse(null, {
        status: 404,
        statusText: "No articulations found",
      });
    } else {
      return NextResponse.json(articulations);
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
