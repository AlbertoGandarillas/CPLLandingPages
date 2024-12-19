import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const searchTerm = url.searchParams.get("searchTerm");
  const cplType = url.searchParams.get("cplType");
  const learningMode = url.searchParams.get("learningMode");
  try {
    const where: Prisma.ViewCPLCertificationsWhereInput = {};
    
    if (cplType && cplType !== 'all') {
      where.CPLType = cplType;
    }

    if (learningMode && learningMode !== "all") {
      where.LearningMode = learningMode;
    }
    
    if (searchTerm && searchTerm.length >= 3) {
      where.OR = [
        { IndustryCertification: { contains: searchTerm } },
        {
          CollegeViews: {
            some: {
              College: { contains: searchTerm },
            },
          },
        },
      ];
    }

    const [totalCount, cplCertifications] = await Promise.all([
      db.viewCPLCertifications.count({ where }),
      db.viewCPLCertifications.findMany({
        where,
        include: {
          CollegeViews: true,
        },
        orderBy: { TotalUnits: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      items: cplCertifications,
      totalCount,
      hasMore: (page * limit) < totalCount,
      currentPage: page
    });

  } catch (error) {
    console.error("Error fetching CPL certifications:", error);
    return NextResponse.json(
      { 
        items: [],
        totalCount: 0,
        hasMore: false,
        currentPage: page,
        error: error instanceof Error ? error.message : "Unexpected server error"
      },
      { status: 500 }
    );
  }
}
