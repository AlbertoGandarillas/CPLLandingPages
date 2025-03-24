import { NextResponse } from "next/server";
import { db } from "../../../../prisma/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create veteran record
    const veteran = await db.veteran.create({
      data: {
        ...body,
        CreatedOn: new Date(),
      }
    });
    // Create associated veteranCPLType record
    await db.veteranCPLType.create({
      data: {
        VeteranID: veteran.id, 
        CPLType: 2,
        Value: true
      }
    });

    return NextResponse.json(veteran);
  } catch (error) {
    console.error("Failed to create veteran:", error);
    return NextResponse.json(
      {
        error: "Failed to create veteran",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}