import { NextResponse } from "next/server";
import { db } from "../../../../../prisma/db";
interface Params {
  params: { slug: string };
}
export async function GET(request: Request, { params }: Params) {
  try {
    const articulations = await db.collegeUIConfig.findMany({
      where: { Slug: params.slug },
      include: {
        College: true,
        Links: true,
        Contacts: {
          orderBy: {
            ContactOrder: 'asc'
          }
        },
      },
    });
    if (!articulations) {
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }
    return NextResponse.json(articulations);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
