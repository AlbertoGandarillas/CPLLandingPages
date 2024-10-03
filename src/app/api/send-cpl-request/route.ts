import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, selectedCourses, CPLAssistantEmail } =
      await request.json();

    console.log("Received request:", {
      firstName,
      lastName,
      email,
      selectedCourses,
      CPLAssistantEmail,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "465"),
      secure: true, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("Transporter created, attempting to verify...");

    try {
      await transporter.verify();
      console.log("Transporter verified successfully");
    } catch (verifyError) {
      console.error("Transporter verification failed:", verifyError);
      throw verifyError;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: CPLAssistantEmail,
      subject: "New CPL Information Request",
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Selected Courses:
        ${selectedCourses.join("\n")}
      `,
      html: `
        <p>Hello,</p>
        <p>My name is ${firstName} ${lastName}, and have a CCCApply id: <CCCApply Id>. I am interested in receiving a CPL review for the following courses:</p>
        <ul>
          ${selectedCourses.map((course: any) => `<li>${course}</li>`).join("")}
        </ul>
        <p>According to your CPL page, the following required evidence is needed:<p>
        [List of required evidence]
        <p>I have attached the evidence I have available and look forward to hearing from you soon!<p>
        <p>Thanks,</p>
        <p>${firstName} ${lastName}</p>
        <p>${email}</p>
      `,
    };

    console.log("Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Failed to send email:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
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
