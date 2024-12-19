import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { GetIndustryCertifications, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

async function getIndustryCertifications(
  creditRecommendation: string | null
): Promise<GetIndustryCertifications[]> {
  return db.$queryRaw<GetIndustryCertifications[]>`
    EXEC GetIndustryCertifications @CreditRecommendation = ${
      creditRecommendation === null ? Prisma.sql`NULL` : creditRecommendation
    }
  `;
}

export async function GET(request: NextRequest) {
  try {
    const creditRecommendation = request.nextUrl.searchParams.get("creditRecommendation");

    console.log("Executing GetIndustryCertifications with creditRecommendation:", creditRecommendation);
    const result = await getIndustryCertifications(creditRecommendation);

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
