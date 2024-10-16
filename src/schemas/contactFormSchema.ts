import { z } from "zod";
const fileSchema = z.object({
  name: z.string(),
  type: z.string(),
  data: z.string(),
});
export const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  CPLAssistantEmail: z.string().email("Invalid CPL Assistant email address"),
  files: z.array(fileSchema).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
