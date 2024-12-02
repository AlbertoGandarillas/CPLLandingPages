import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  try {
    const topcodes = await db.viewCPLMostCommonTopCodes.findMany({
      orderBy: { Count: "desc" },
    });
    if (topcodes.length === 0) {
      return new NextResponse(null, {
        status: 404,
        statusText: "No types found",
      });
    } else {
      return NextResponse.json(topcodes);
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  return new NextResponse(null, {
    status: 500,
    statusText: "Unexpected server error",
  });
}
