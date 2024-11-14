import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const college = url.searchParams.get("college");
  const industryCertification = url.searchParams.get("industryCertification");
  const cplType = url.searchParams.get("cplType");
  const learningMode = url.searchParams.get("learningMode");
  const searchTerm = url.searchParams.get("searchTerm");
  const outlineIds = url.searchParams.get("outlineIds");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");

  try {
    const where: Prisma.ViewCPLCoursesWhereInput = {};

    if (college && college !== "0") {
      where.CollegeID = parseInt(college);
    }

    // Handle outline IDs for selected courses
    if (outlineIds) {
      where.OutlineID = {
        in: outlineIds.split(",").map((id) => parseInt(id)),
      };
      // When fetching specific courses, ignore pagination
      const selectedCourses = await db.viewCPLCourses.findMany({
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

      return NextResponse.json({
        data: selectedCourses,
        metadata: {
          totalCount: selectedCourses.length,
          currentPage: 1,
          pageSize: selectedCourses.length,
          totalPages: 1,
          hasMore: false,
        },
      });
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

    if (searchTerm) {
      where.OR = [
        { Course: { contains: searchTerm } },
        { Subject: { contains: searchTerm } },
        { College: { contains: searchTerm } },
        { CourseTitle: { contains: searchTerm } },
        {
          IndustryCertifications: {
            some: {
              OR: [
                { IndustryCertification: { contains: searchTerm } },
                { CPLTypeDescription: { contains: searchTerm } },
                { CPLModeofLearningDescription: { contains: searchTerm } }
              ]
            }
          }
        }
      ];
    }

    const [totalCount, commonCourses] = await Promise.all([
      db.viewCPLCourses.count({ where }),
      db.viewCPLCourses.findMany({
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
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    if (commonCourses.length === 0) {
      return new NextResponse(null, {
        status: 404,
        statusText: "No articulations found",
      });
    }

    return NextResponse.json(commonCourses);
  } catch (error: any) {
    if (error?.message?.includes("maximum of 2100 parameters")) {
      return NextResponse.json(
        {
          error: "The result of your search is too large. Please adjust your search criteria to narrow down the results.",
        },
        { status: 400 }
      );
    }

    console.error("API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
