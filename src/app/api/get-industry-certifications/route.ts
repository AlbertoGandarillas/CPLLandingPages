import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { GetIndustryCertifications, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

async function getIndustryCertifications(
  creditRecommendation: string | null,
  catalogYearId: number | null
): Promise<GetIndustryCertifications[]> {
  return db.$queryRaw<GetIndustryCertifications[]>`
    EXEC GetIndustryCertifications 
      @CreditRecommendation = ${creditRecommendation === null ? Prisma.sql`NULL` : creditRecommendation},
      @CatalogYearID = ${catalogYearId === null ? Prisma.sql`NULL` : catalogYearId}
  `;
}

export async function GET(request: NextRequest) {
  try {
    const creditRecommendation = request.nextUrl.searchParams.get("creditRecommendation");
    const catalogYearId = request.nextUrl.searchParams.get("catalogYearId");

    // Skip parameters if both are null/"null" string
    if ((creditRecommendation === "null" || creditRecommendation === null) && 
        (catalogYearId === "null" || catalogYearId === null)) {
      const result = await getIndustryCertifications(null, null);
      if (result.length === 0) {
        return NextResponse.json({ message: "No data found" }, { status: 404 });
      }
      return NextResponse.json(result);
    }

    // Only parse and pass parameters that have actual values
    const parsedCatalogYearId = catalogYearId && catalogYearId !== "null" ? parseInt(catalogYearId) : null;
    const parsedCreditRecommendation = creditRecommendation !== "null" ? creditRecommendation : null;

    console.log("Executing GetIndustryCertifications with creditRecommendation:", parsedCreditRecommendation, "and catalogYearId:", parsedCatalogYearId);
    const result = await getIndustryCertifications(parsedCreditRecommendation, parsedCatalogYearId);

    if (result.length === 0) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error executing stored procedure:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}
