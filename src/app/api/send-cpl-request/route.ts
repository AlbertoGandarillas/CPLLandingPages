import { NextResponse } from "next/server";
import { EmailService } from "@/services/emailService";
import { cplRequestSchema, CPLRequestData } from "@/schemas/cplRequestSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = cplRequestSchema.parse(body) as CPLRequestData;

    const {
      firstName,
      lastName,
      email,
      selectedCourses,
      CPLAssistantEmail,
      files,
      unlistedQualifications,
      cccApplyId,
      collegeId,
    } = validatedData;

    const attachments =
      files?.map((file) => ({
        filename: file.name,
        content: file.data.replace(/^data:.*?;base64,/, ""),
        encoding: "base64",
      })) || [];

    const coursesHtml = selectedCourses
      .map(
        ({ course, certifications }) => `
      <li>
        ${course}
        ${
          certifications.length > 0
            ? `
          <ul>
            ${certifications.map((cert) => `<li>${cert}</li>`).join("")}
          </ul>
        `
            : ""
        }
      </li>
    `
      )
      .join("");
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: CPLAssistantEmail,
      subject: "New CPL Information Request",
      cc: email,
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        CCC Apply ID: ${cccApplyId || "None provided"}
        Selected Courses:
        ${selectedCourses.join("\n")}
        Unlisted Qualifications:
        ${unlistedQualifications || "None provided"}
      `,
      html: `
        <p>Hello,</p>
        <p>My name is ${firstName} ${lastName} and I am interested in receiving a CPL review for the following courses:</p>
        <ul>
          ${coursesHtml}
        </ul>
        ${
          unlistedQualifications
            ? `
          <p>Additionally, I have the following unlisted qualifications:</p>
          <p>${unlistedQualifications}</p>
        `
            : ""
        }
        ${
          attachments.length > 0
            ? `<p>I have attached the evidence I have available and look forward to hearing from you soon!</p>`
            : ""
        }    
        <p>Thanks,</p>
        <p>${firstName} ${lastName}</p>
        <p>${email}</p>
        <p>${cccApplyId ? `Student ID or CCCApply ID: ${cccApplyId}` : ""}</p>
      `,
      attachments,
      unlistedQualifications,
    };

    const info = await EmailService.sendEmail(mailOptions);

    return NextResponse.json({ success: true, messageId: info.messageId });
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
