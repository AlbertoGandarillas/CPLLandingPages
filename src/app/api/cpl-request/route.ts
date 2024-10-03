import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Log the raw request body
    const rawBody = await request.text();
    console.log("Raw request body:", rawBody);

    // Attempt to parse the JSON
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      email,
      hasCCCApplyId,
      cccApplyId,
      selectedCourses,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !selectedCourses) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newRequest = await prisma.cPLRequest.create({
      data: {
        firstName,
        lastName,
        email,
        hasCCCApplyId,
        cccApplyId,
        selectedCourses: JSON.stringify(selectedCourses),
      },
    });

    return NextResponse.json(
      { success: true, data: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in CPL request handler:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
