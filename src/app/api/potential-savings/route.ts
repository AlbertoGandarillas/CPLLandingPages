import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { PotentialCPLSavings, Prisma } from "@prisma/client";

// Make this route dynamic
export const dynamic = "force-dynamic";

async function getPotentialCPLSavings(
  cplType: number | null
): Promise<PotentialCPLSavings[]> {
  return db.$queryRaw<PotentialCPLSavings[]>`
    EXEC GetPotentialCPLSavings @cpltype = ${
      cplType === null ? Prisma.sql`NULL` : cplType
    }
  `;
}

export async function GET(request: NextRequest) {
  try {
    const cplTypeParam = request.nextUrl.searchParams.get("cpltype");
    let cplType: number | null = null;

    if (cplTypeParam !== null) {
      cplType = parseInt(cplTypeParam, 10);
      if (isNaN(cplType)) {
        return NextResponse.json(
          { message: "Invalid cpltype parameter" },
          { status: 400 }
        );
      }
    }

    console.log("Executing GetPotentialCPLSavings with cplType:", cplType);
    const result = await getPotentialCPLSavings(cplType);

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
