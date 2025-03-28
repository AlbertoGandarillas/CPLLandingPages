import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// Define the type for our where clause
type ExhibitsWhereInput = Prisma.ViewCPLCollaborativeExhibitsWhereInput;
type CreditRecommendationsWhereInput = Prisma.ViewCPLCollaborativeCRsWhereInput;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ccc = searchParams.get("ccc");
    const status = searchParams.get("status");
    const searchTerm = searchParams.get("searchTerm");
    const isExport = searchParams.get("export") === "true";
    const collegeID = searchParams.get("collegeID");
    const modelOfLearning = searchParams.get("modelOfLearning");
    const cplType = searchParams.get("cplType");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Build the where clause for ViewCPLCollaborativeExhibits
    const exhibitsWhere: ExhibitsWhereInput = {};

    // Handle CCC parameter
    if (ccc !== null && ccc === "1") {
      exhibitsWhere.collaborativeTypes = {
        some: {
          CollaborativeID: 1
        }
      };
    }

    if (modelOfLearning) {
      exhibitsWhere.ModelOfLearning = parseInt(modelOfLearning);
    }
    if (cplType) {
      exhibitsWhere.CPLType = parseInt(cplType);
    }

    // Handle collegeID parameter
    const collegeCondition = collegeID ? { CollegeID: parseInt(collegeID) } : {};
    // Build combined where conditions
    let searchConditions: Prisma.ViewCPLCollaborativeExhibitsWhereInput[] = [];
    let collegeConditions: Prisma.ViewCPLCollaborativeExhibitsWhereInput[] = [];

    // Add search functionality
    if (searchTerm) {
      searchConditions = [
        { Title: { contains: searchTerm } },
        { AceID: { contains: searchTerm } },
        { college: { contains: searchTerm } },
        { ArticulatedCourses: { contains: searchTerm } },
        { ArticulatedColleges: { contains: searchTerm } },
        { CreditRecommendations: { contains: searchTerm } },
      ];
    }

    // Add college filtering condition
    if (collegeID) {
      collegeConditions = [
        { CollegeID: parseInt(collegeID) },
        {
          ArticulatedCollegeIDs: {
            not: null,
            contains: collegeID,
          }
        }
      ];
    }

    // Combine conditions with AND if both present
    if (searchTerm && collegeID) {
      exhibitsWhere.AND = [
        { OR: searchConditions },
        { OR: collegeConditions }
      ];
    } else if (searchTerm) {
      exhibitsWhere.OR = searchConditions;
    } else if (collegeID) {
      exhibitsWhere.OR = collegeConditions;
    }

    // Get total count for pagination
    const totalCount = await db.viewCPLCollaborativeExhibits.count({
      where: exhibitsWhere,
    });
    // Fetch paginated exhibits with related data
    const exhibits = await db.viewCPLCollaborativeExhibits.findMany({
      where: exhibitsWhere,
      include: {
        collaborativeTypes: true,
        creditRecommendations: {
          include: {
            articulations: status != "all"  && status ? {
              where: {
                Status: status
              }
            } : true
          }
        }
      },
      orderBy: {
        Title: "asc",
      },
      ...(isExport
        ? {}
        : {
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
    });

    if (isExport) {
      return NextResponse.json(exhibits);
    }

    // Format the response with type safety
    const formattedExhibits = exhibits.map((exhibit) => {
      const { creditRecommendations, collaborativeTypes, ...rest } = exhibit;
      return {
        ...rest,
        creditRecommendations: creditRecommendations || [],
        collaborativeTypes: collaborativeTypes || [],
      };
    });

    // Return paginated response
    return NextResponse.json({
      data: formattedExhibits,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching collaborative exhibits:", error);
    return NextResponse.json(
      { error: "Failed to fetch collaborative exhibits" },
      { status: 500 }
    );
  }
}
