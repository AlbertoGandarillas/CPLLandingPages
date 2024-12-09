import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  try {
    const cids = await db.viewCPLMostCommonCIDs.findMany({
      orderBy: { Count: "desc" },
    });
    if (cids.length === 0) {
      return new NextResponse(null, {
        status: 404,
        statusText: "No types found",
      });
    } else {
      return NextResponse.json(cids);
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
