import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  try {
    const cplMos = await db.viewCPLMos.findMany({
      orderBy: [{ Occupation: "asc" }, { IndustryCertification: "asc" }],
    });
    if (cplMos.length === 0) {
      return new NextResponse(null, {
        status: 404,
        statusText: "No MOS found",
      });
    } else {
      return NextResponse.json(cplMos);
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
