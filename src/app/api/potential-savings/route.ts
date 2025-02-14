import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { PotentialCPLSavings, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

async function getPotentialCPLSavings(
  cplType: number | null,
  catalogYear: string | null
): Promise<PotentialCPLSavings[]> {
  return db.$queryRaw<PotentialCPLSavings[]>`
    EXEC GetPotentialCPLSavings 
      @cpltype = ${cplType === null ? Prisma.sql`NULL` : cplType},
      @catalogyear = ${catalogYear === null ? Prisma.sql`NULL` : catalogYear}
  `;
}

export async function GET(request: NextRequest) {
  try {
    const cplTypeParam = request.nextUrl.searchParams.get("cpltype");
    const catalogYearParam = request.nextUrl.searchParams.get("catalogyear");
    let cplType: number | null = null;
    let catalogYear: string | null = null;

    if (cplTypeParam !== null) {
      cplType = parseInt(cplTypeParam, 10);
      if (isNaN(cplType)) {
        return NextResponse.json(
          { message: "Invalid cpltype parameter" },
          { status: 400 }
        );
      }
    }

    if (catalogYearParam !== null) {
      catalogYear = catalogYearParam;
    }

    console.log("Executing GetPotentialCPLSavings with cplType:", cplType, "and catalogYear:", catalogYear);
    const result = await getPotentialCPLSavings(cplType, catalogYear);

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
