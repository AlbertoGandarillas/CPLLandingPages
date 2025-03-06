import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../prisma/db";

export const dynamic = "force-dynamic"; // This makes the route dynamic

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const email = searchParams.get("email");
    const collegeId = searchParams.get("collegeId");

    const veteran = await db.veteran.findFirst({
      where: {
        FirstName: firstName || undefined,
        LastName: lastName || undefined,
        Email: email || undefined,
        CollegeID: collegeId ? parseInt(collegeId) : undefined,
      },
      select: {
        id: true,
        FirstName: true,
        LastName: true,
        Email: true,
        CollegeID: true,
        StudentID: true,
        PotentialStudent: true,
        CPLLandingPage: true,
      },
    });

    if (!veteran) {
      return NextResponse.json({ exists: false, veteran: null });
    }

    return NextResponse.json({
      exists: true,
      veteran: veteran,
    });
  } catch (error) {
    console.error("Error checking veteran:", error);
    return NextResponse.json(
      { error: "Failed to check veteran" },
      { status: 500 }
    );
  }
}
