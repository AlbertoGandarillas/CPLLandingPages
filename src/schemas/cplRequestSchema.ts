import { z } from "zod";
const fileSchema = z.object({
  name: z.string(),
  type: z.string(),
  data: z.string(),
});
export const cplRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  selectedCourses: z.array(
    z.object({
      course: z.string(),
      certifications: z.array(z.string()),
    })
  ),
  CPLAssistantEmail: z.string().email("Invalid CPL Assistant email address"),
  files: z.array(fileSchema).optional(),
  unlistedQualifications: z.string().optional(),
  cccApplyId: z.string().optional(),
});

export type CPLRequestData = z.infer<typeof cplRequestSchema>;
