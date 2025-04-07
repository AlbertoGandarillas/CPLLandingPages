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
        // First get all IDs with a simple query
        const exhibitIds = await db.viewCPLCollaborativeExhibits.findMany({
          where: exhibitsWhere,
          select: {
            id: true
          },
          orderBy: {
            Title: "asc"
          }
        });

        const results = [];
        const batchSize = 10; // Reduced batch size to avoid parameter limit

        // Process in smaller batches
        for (let i = 0; i < exhibitIds.length; i += batchSize) {
          const currentBatch = exhibitIds.slice(i, i + batchSize);
          
          // Process each ID individually to avoid parameter explosion
          const batchPromises = currentBatch.map(({ id }) => 
            db.viewCPLCollaborativeExhibits.findUnique({
              where: { id },
              select: {
                id: true,
                AceID: true,
                Title: true,
                college: true,
                VersionNumber: true,
                collaborativeTypes: {
                  select: {
                    Description: true
                  }
                },
                creditRecommendations: {
                  select: {
                    CreditRecommendation: true,
                    articulations: {
                      where: status !== "all" && status ? {
                        Status: status
                      } : {},
                      select: {
                        Status: true,
                        Course: true,
                        college: true
                      }
                    }
                  }
                }
              }
            })
          );

          // Wait for all promises in the current batch
          const batchResults = await Promise.all(batchPromises);
          
          // Filter out null results and add to results array
          results.push(...batchResults.filter(result => result !== null));

          // Add a small delay between batches to prevent overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Format the results for export
        const formattedResults = results.flatMap(exhibit => {
          if (!exhibit) return [];

          const collaborativeTypes = exhibit.collaborativeTypes
            ?.map(type => type.Description)
            .join(", ") || "";

          if (!exhibit.creditRecommendations?.length) {
            return [{
              ExhibitID: exhibit.AceID || "",
              Title: exhibit.Title || "",
              "Exhibit College": exhibit.college || "",
              Version: exhibit.VersionNumber || "",
              "Credit Recommendation": "",
              Status: "",
              "Articulation College": "",
              Course: "",
              "Collaborative Types": collaborativeTypes
            }];
          }

          return exhibit.creditRecommendations.flatMap(cr => {
            if (!cr.articulations?.length) {
              return [{
                ExhibitID: exhibit.AceID || "",
                Title: exhibit.Title || "",
                "Exhibit College": exhibit.college || "",
                Version: exhibit.VersionNumber || "",
                "Credit Recommendation": cr.CreditRecommendation || "",
                Status: "",
                "Articulation College": "",
                Course: "",
                "Collaborative Types": collaborativeTypes
              }];
            }

            return cr.articulations.map(articulation => ({        
              ExhibitID: exhibit.AceID || "",
              Title: exhibit.Title || "",
              "Exhibit College": exhibit.college || "",
              Version: exhibit.VersionNumber || "",
              "Credit Recommendation": cr.CreditRecommendation || "",
              Status: articulation.Status || "",
              "Articulation College": articulation.college || "",
              Course: articulation.Course || "",
              "Collaborative Types": collaborativeTypes
            }));
          });
        });

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
      where: exhibitsWhere,
      include: {
        collaborativeTypes: true,
        creditRecommendations: {
          include: {
            articulations: status !== "all" && status ? {
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
