import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../prisma/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const document = await db.cPLExhibitDocuments.findFirst({
      where: {
        id: parseInt(params.documentId),
      },
    });

    if (!document || !document.BinaryData) {
      return new NextResponse(null, {
        status: 404,
        statusText: "Document not found",
      });
    }

    // Convert the binary data to a Buffer
    const buffer = Buffer.from(document.BinaryData);

    // Get file extension and set appropriate MIME type
    const extension = document.FileName?.split(".").pop()?.toLowerCase() || "";
    const mimeType = getMimeType(extension);

    // Return file with proper headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${document.FileName}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading document:", error);
    return new NextResponse(null, {
      status: 500,
      statusText: "Error downloading document",
    });
  }
}

function getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    txt: "text/plain",
    csv: "text/csv",
  };

  return mimeTypes[extension] || "application/octet-stream";
}
