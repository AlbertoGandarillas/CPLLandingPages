import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// Define the type for our where clause
type ExhibitsWhereInput = Prisma.ViewCPLCollaborativeExhibitsWhereInput;

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
    const creditRecommendation = searchParams.get("creditRecommendation");
    const industryCert = searchParams.get("industryCert");
    const topCode = searchParams.get("topCode");
    const cidNumber = searchParams.get("cidNumber");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

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
    if (creditRecommendation) {
      exhibitsWhere.CreditRecommendations = {
        contains: creditRecommendation
      };
    }
    if (industryCert) {
      exhibitsWhere.Title = {
        contains: industryCert
      };
    }
    if (topCode) {
      exhibitsWhere.TopCodes = {
        contains: topCode
      }
    }
    if (cidNumber) {
      exhibitsWhere.CIDNumbers = {
        contains: cidNumber
      };
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

    if (isExport) {
      try {
        // Get all records from ViewExportArticulatedExhibits with filters
        const results = await db.viewExportArticulatedExhibits.findMany({
          where: {
            ...(ccc === "1" ? {
              CollaborativeID: 1
            } : {}),
            ...(modelOfLearning ? {
              ModelOfLearning: parseInt(modelOfLearning)
            } : {}),
            ...(cplType ? {
              CPLType: parseInt(cplType)
            } : {}),
            ...(creditRecommendation ? {
              CreditRecommendation: {
                contains: creditRecommendation
              }
            } : {}),
            ...(industryCert ? {
              Title: {
                contains: industryCert
              }
            } : {}),
            ...(topCode ? {
              TopCode: parseInt(topCode)
            } : {}),
            ...(cidNumber ? {
              CIDNumber: {
                contains: cidNumber
              }
            } : {}),
            ...(collegeID ? {
              OR: [
                { CollegeID: parseInt(collegeID) },
              ]
            } : {}),
            ...(status && status !== "all" ? {
              Status: status
            } : {}),
            ...(searchTerm ? {
              OR: [
                { Title: { contains: searchTerm } },
                { AceID: { contains: searchTerm } },
                { college: { contains: searchTerm } },
                { Course: { contains: searchTerm } },
                { CreditRecommendation: { contains: searchTerm } }
              ]
            } : {})
          },
          orderBy: [
            { AceID: 'asc' },
            { CreditRecommendation: 'asc' }
          ]
        });

        // Format the results for export
        const formattedResults = results.map(exhibit => ({
          ExhibitID: exhibit.AceID || "",
          Title: exhibit.Title || "",
          Version: exhibit.VersionNumber || "",
          "Credit Recommendation": exhibit.CreditRecommendation || "",
          "Skill Level": exhibit.SkillLevel || "",
          Status: exhibit.Status || "",
          "Articulation College": exhibit.college || "",
          Course: exhibit.Course || "",
          "Collaborative Types": exhibit.CollaborativeType || ""
        }));

        return NextResponse.json(formattedResults);
      } catch (error) {
        console.error("Error in export:", error);
        return NextResponse.json(
          { error: "Failed to export exhibits", details: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }

    // Get total count for pagination
    const totalCount = await db.viewCPLCollaborativeExhibits.count({
      where: exhibitsWhere,
    });

    // Fetch paginated exhibits with related data
    const exhibits = await db.viewCPLCollaborativeExhibits.findMany({
      where: {
        ...exhibitsWhere,
        ...(status !== "all" && status ? {
          creditRecommendations: {
            some: {
              articulations: {
                some: {
                  Status: status === "In Progress" ? 
                    { in: ["In Progress", "Not Articulated"] } : 
                    status
                }
              }
            }
          }
        } : {})
      },
      include: {
        collaborativeTypes: true,
        creditRecommendations: {
          include: {
            articulations: status !== "all" && status ? {
              where: {
                Status: status === "In Progress" ? 
                  { in: ["In Progress", "Not Articulated"] } : 
                  status
              }
            } : true
          }
        }
      },
      orderBy: {
        Title: "asc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

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
