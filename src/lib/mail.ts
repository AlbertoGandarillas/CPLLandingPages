import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "465"),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    } as SMTPTransport.Options);

    export const sendMail = async (to: string, subject: string, text: string, html: string) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to,
                subject,
                text,
                html,
            });
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }