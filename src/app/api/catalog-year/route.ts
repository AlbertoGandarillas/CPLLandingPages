import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const catalogYearId = url.searchParams.get("id");

  try {
    if (catalogYearId) {
      // Get specific catalog year if ID provided
      const catalogYear = await db.lookupCatalogYear.findUnique({
        where: {
          ID: parseInt(catalogYearId)
        }
      });

      if (!catalogYear) {
        return new NextResponse(null, {
          status: 404,
          statusText: "Catalog year not found"
        });
      }

      return NextResponse.json(catalogYear);

    } else {
      // Get all catalog years if no ID provided
      const catalogYears = await db.lookupCatalogYear.findMany({
        orderBy: { EndDate: "desc" },
      });

      if (catalogYears.length === 0) {
        return new NextResponse(null, {
          status: 404, 
          statusText: "No catalog years found"
        });
      }

      return NextResponse.json(catalogYears);
    }

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    
    return new NextResponse(null, {
      status: 500,
      statusText: "Unexpected server error"
    });
  }
}
