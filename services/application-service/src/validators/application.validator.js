import { z } from "zod";
import { applicationStages } from "../../../../shared/src/domain/constants.js";

const resumeSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  data: z.string().min(10),
});

const detailsSchema = z.object({
  phone: z.string().min(10, "Phone: at least 10 digits"),
  college: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.string().optional(),
  experience: z.string().optional(),
  portfolioUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  expectedSalary: z.string().optional(),
  availability: z.string().optional(),
});

export const applicationSchema = z.object({
  jobId: z.string().min(6, "Invalid job"),
  note: z.string().min(10, "Note: at least 10 characters"),
  resume: resumeSchema,
  details: detailsSchema,
});

export const stageSchema = z.object({
  stage: z.enum(applicationStages),
});
