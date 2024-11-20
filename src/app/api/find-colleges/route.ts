import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../prisma/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const ignorePaging = url.searchParams.get("ignorePaging") === "true";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const searchTerm = url.searchParams.get("searchTerm");
  try {
    const where: Prisma.LookupCollegesWhereInput = {};
    if (searchTerm) {
      where.OR = [{ College: { contains: searchTerm } },
        { ZipCode: { contains: searchTerm } },
        { City: { contains: searchTerm } },
        { County: { contains: searchTerm } },
      ];
    }

    const [totalCount, colleges] = await Promise.all([
      db.lookupColleges.count({ where }),
      db.lookupColleges.findMany({
        where: {
          ...where,
          CollegeID: {
            notIn: [4,5,63,120]
        },
        },
        orderBy: { College: "asc" },
        ...(ignorePaging ? {} : {
          skip: (page - 1) * limit,
          take: limit,
        }),
      }),
    ]);

    if (colleges.length === 0) {
      return new NextResponse(null, {
        status: 404,
        statusText: "No Colleges found",
      });
    }

    return NextResponse.json(colleges);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching colleges:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  return new NextResponse(null, {
    status: 500,
    statusText: "Unexpected server error",
  });
}
