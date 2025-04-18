import { NextRequest, NextResponse } from "next/server";
import { EmailService } from "@/services/emailService";
import {
  contactFormSchema,
  ContactFormData,
} from "@/schemas/contactFormSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body) as ContactFormData;
    const attachments =
      validatedData.files?.map((file) => ({
        filename: file.name,
        content: file.data.replace(/^data:.*?;base64,/, ""),
        encoding: "base64",
      })) || [];

    const { firstName, lastName, email, message, CPLAssistantEmail, files } =
      validatedData;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: CPLAssistantEmail,
      cc: email,
      subject: "New CPL Information Request",
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Message:
        ${message},
      `,
      attachments,
      html: `
        <p>Name: ${firstName} ${lastName}</p> 
        <p>Email: ${email}</p>
        <p>Message:</p>
       <p>
          ${message}
        </p>
      `,
    };
    console.log("Attempting to send email with options:", {
      from: mailOptions.from, 
      to: mailOptions.to,
      subject: mailOptions.subject,
    });
    const info = await EmailService.sendEmail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to process request:", error);
    if (error instanceof Error && "errors" in error) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
