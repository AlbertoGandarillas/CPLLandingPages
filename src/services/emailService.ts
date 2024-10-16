import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true,
});

interface EmailOptions extends Omit<nodemailer.SendMailOptions, "attachments"> {
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail(options: EmailOptions) {
  try {
    if (!options.from) {
      options.from = process.env.EMAIL_FROM;
    }

    console.log("Attempting to send email with options:", {
      from: options.from,
      to: options.to,
      subject: options.subject,
    });

  const info = await transporter.sendMail({
    ...options,
    attachments: options.attachments?.map((attachment) => ({
      ...attachment,
      content:
        typeof attachment.content === "string"
          ? Buffer.from(attachment.content, "base64")
          : attachment.content,
    })),
  });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error("Failed to send email. Please try again later.");
  }
}
