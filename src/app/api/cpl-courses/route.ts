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
    if (industryCertification) {
      where.IndustryCertifications = {
        some: {
          IndustryCertification: {
            contains: industryCertification,
          },
        },
      };
    }
    if (cplType) {
      where.IndustryCertifications = {
        some: {
          CPLType: {
            equals: parseInt(cplType),
          },
        },
      };
    }
    if (learningMode) {
      where.IndustryCertifications = {
        some: {
          ModelOfLearning: {
            equals: parseInt(learningMode),
          },
        },
      };
    }
    const commonCourses = await db.viewCPLCourses.findMany({
      where,
      include: {
        IndustryCertifications: {
          include: {
            Evidences: true,
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
