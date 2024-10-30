import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const college = url.searchParams.get("college");
  const industryCertification = url.searchParams.get("industryCertification");
  const cplType = url.searchParams.get("cplType");
  const learningMode = url.searchParams.get("learningMode");
  try {
    const where: Prisma.ViewCPLCoursesWhereInput = {};
    if (college) {
      where.CollegeID = parseInt(college);
    }
    if (industryCertification || cplType || learningMode) {
      where.IndustryCertifications = {
        some: {
          ...(industryCertification && {
            IndustryCertification: { contains: industryCertification },
          }),
          ...(cplType && { CPLType: { equals: parseInt(cplType) } }),
          ...(learningMode && {
            ModelOfLearning: { equals: parseInt(learningMode) },
          }),
        },
      };
    }

    const commonCourses = await db.viewCPLCourses.findMany({
      where,
      include: {
        IndustryCertifications: {
          include: {
            Evidences: true,
            CreditRecommendations: true,
          },
        },
      },
      orderBy: [{ Subject: "asc" }, { CourseNumber: "asc" }],
    });

    if (commonCourses.length === 0) {
      return new NextResponse(null, {
        status: 404,
        statusText: "No articulations found",
      });
    } else {
      return NextResponse.json(commonCourses);
    }
  } catch (error: any) {
    if (error?.message?.includes("maximum of 2100 parameters")) {
      return NextResponse.json(
        {
          error:
            "The result of your search is too large. Please adjust your search criteria to narrow down the results.",
        },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  return new NextResponse(null, {
    status: 500,
    statusText: "Unexpected server error",
  });
}
