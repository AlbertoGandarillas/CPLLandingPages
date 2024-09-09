import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const college = url.searchParams.get("college");
  const industryCertification = url.searchParams.get("industryCertification");
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
    const commonCourses = await db.viewCPLCourses.findMany({
      where,
      include: {
        Evidence: true,
        IndustryCertifications: true,
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

