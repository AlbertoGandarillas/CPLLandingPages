import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";
import { CatalogYearService } from "@/utils/CatalogYear";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const college = url.searchParams.get("college");
  const cplType = url.searchParams.get("cplType");
  const learningMode = url.searchParams.get("learningMode");
  const criteria = url.searchParams.get("criteria");
  const topCode = url.searchParams.get("topCode");
  const cidNumber = url.searchParams.get("cidNumber");
  const searchTerm = url.searchParams.get("searchTerm");
  const indCert = url.searchParams.get("indCert");
  const catalogYearId = url.searchParams.get("catalogYearId");

  try {
    const where: Prisma.ViewCPLArticulationsWhereInput = {};

    if (catalogYearId) {
        const { startDate, endDate } = await CatalogYearService.getDateRange(
          catalogYearId,
          url.origin
        );
        if (startDate && endDate) {
          where.LastSubmittedOn = {
            gte: startDate,
            lte: endDate,
          };
        }
    }

    if (college) {
      where.CollegeID = parseInt(college);
    }
    if (cplType) {
      where.CPLType = parseInt(cplType);
    }
    if (learningMode) {
      where.ModelOfLearning = parseInt(learningMode);
    }
    if (criteria) {
      where.Criteria = criteria;
    }
    if (indCert) {
      where.IndustryCertification = indCert;
    }
    if (topCode) {
      where.TopCode = parseInt(topCode);
    }
    if (cidNumber) {
      where.CIDNumber = cidNumber;
    }
    if (searchTerm) {
      where.OR = [
        { Subject: { contains: searchTerm } },
        { College: { contains: searchTerm } },
        { CourseNumber: { contains: searchTerm } },
        { CourseTitle: { contains: searchTerm } },
        { AceID: { contains: searchTerm } },
        { IndustryCertification: { contains: searchTerm } },
        { CPLTypeDescription: { contains: searchTerm } },
        { CPLModeofLearningDescription: {  contains: searchTerm, }, },
        { Criteria: { contains: searchTerm } },
        { CIDNumber: { contains: searchTerm } },
        { IndustryCertification: { contains: searchTerm }, },
        { CIDDescriptor: { contains: searchTerm } },
        { Program_Title: { contains: searchTerm } },
        { Course: { contains: searchTerm } },
      ];
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
