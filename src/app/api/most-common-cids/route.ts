import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { GetCPLMostCommonCIDs, Prisma } from "@prisma/client";
import { CatalogYearService } from "@/utils/CatalogYear";

// Helper function to convert BigInt to regular number
const serializeBigInt = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
};

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const catalogYearId = url.searchParams.get("catalogYearId");

  try {
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (catalogYearId) {
        const dateRange = await CatalogYearService.getDateRange(
          catalogYearId,
          url.origin
        );
        startDate = dateRange.startDate;
        endDate = dateRange.endDate;
    }

    const cids = await db.$queryRaw<GetCPLMostCommonCIDs[]>`
      EXEC GetCPLMostCommonCIDs
        @StartDate = ${startDate === null ? Prisma.sql`NULL` : startDate},
        @EndDate = ${endDate === null ? Prisma.sql`NULL` : endDate}
    `;

    console.log("Found CIDs count:", cids.length);

    // Convert BigInt values to numbers before sending response
    const serializedCids = serializeBigInt(cids);

    return NextResponse.json(serializedCids);
  } catch (error) {
    console.error("API error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message, details: error.stack },
        { status: 500 }
      );
    }
    return new NextResponse(null, {
      status: 500,
      statusText: "Unexpected server error",
    });
  }
}
