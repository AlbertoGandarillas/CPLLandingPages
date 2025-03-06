import { NextResponse } from "next/server";
import { db } from "../../../../../../prisma/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const veteranId = parseInt(params.id);
    const body = await request.json();

    // Convert base64 string to Buffer
    let binaryData = null;
    if (body.BinaryData) {
      // Remove data URL prefix if present (e.g., "data:application/pdf;base64,")
      const base64Data =
        body.BinaryData.split(";base64,").pop() || body.BinaryData;
      binaryData = Buffer.from(base64Data, "base64");
    }

    const document = await db.veteranDocuments.create({
      data: {
        ...body,
        BinaryData: binaryData, // Use the converted Buffer
        VeteranID: veteranId,
        NewDate: new Date(),
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Failed to create veteran document:", error);
    return NextResponse.json(
      {
        error: "Failed to create veteran document",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
