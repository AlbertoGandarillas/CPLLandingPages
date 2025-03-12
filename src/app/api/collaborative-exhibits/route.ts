import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// Define the type for our where clause
type ExhibitsWhereInput = Prisma.ViewCPLCollaborativeExhibitsWhereInput;
type ArticulationsWhereInput =
  Prisma.ViewCPLCollaborativeArticulationsWhereInput;

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
    // When ccc is "0", don't filter by CollaborativeID to include all records
    if (modelOfLearning) {
      exhibitsWhere.ModelOfLearning = parseInt(modelOfLearning);
    }
    if (cplType) {
      exhibitsWhere.CPLType = parseInt(cplType);
    }

    // Handle collegeID parameter
    if (collegeID) {
      exhibitsWhere.CollegeID = parseInt(collegeID);
    }

    // Build the where clause for ViewCPLCollaborativeArticulations
    const articulationsWhere: ArticulationsWhereInput = {};

    // Handle status parameter
    if (status) {
      articulationsWhere.Status = status;
    }

    // Add search functionality for both exhibits and articulations
    if (searchTerm) {
      exhibitsWhere.OR = [
        { Title: { contains: searchTerm } },
        { AceID: { contains: searchTerm } },
        { college: { contains: searchTerm } },
        {
          articulations: {
            some: {
              OR: [
                { CreditRecommendation: { contains: searchTerm } },
                { Status: { contains: searchTerm } },
                { college: { contains: searchTerm } },
                { Course: { contains: searchTerm } },
              ],
            },
          },
        },
      ];
    }

    // Get total count for pagination
    const totalCount = await db.viewCPLCollaborativeExhibits.count({
      where: exhibitsWhere,
    });

    // Fetch paginated exhibits with filtered articulations
    const exhibits = await db.viewCPLCollaborativeExhibits.findMany({
      where: exhibitsWhere,
      include: {
        articulations: {
          where: articulationsWhere,
          orderBy: [{ CreditRecommendation: "asc" }, { Course: "asc" }],
        },
        collaborativeTypes: true,
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
      const { articulations, collaborativeTypes, ...rest } = exhibit;
      return {
        ...rest,
        articulations: articulations || [],
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
