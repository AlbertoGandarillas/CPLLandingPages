import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import tls from "tls";

export async function POST(request: Request) {
  try {
    const { name, email, selectedCourses, CPLAssistantEmail } =
      await request.json();

    console.log("Received request:", {
      name,
      email,
      selectedCourses,
      CPLAssistantEmail,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("Transporter created");

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: CPLAssistantEmail,
      subject: "New CPL Information Request",
      text: `
        Name: ${name}
        Email: ${email}
        Selected Courses:
        ${selectedCourses.join("\n")}
      `,
      html: `
        <h1>New CPL Information Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Selected Courses:</strong></p>
        <ul>
          ${selectedCourses.map((course:any) => `<li>${course}</li>`).join("")}
        </ul>
      `,
    };

    console.log("Sending email with options:", mailOptions);

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
