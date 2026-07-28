import { z } from "zod";
import { applicationStages } from "../../../../shared/src/domain/constants.js";

const resumeSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  data: z.string().min(10),
});

const detailsSchema = z.object({
  phone: z.string().min(10, "Phone: at least 10 digits"),
  college: z.string().nullish(),
  degree: z.string().nullish(),
  graduationYear: z.string().nullish(),
  experience: z.string().nullish(),
  portfolioUrl: z.string().nullish(),
  linkedinUrl: z.string().nullish(),
  expectedSalary: z.string().nullish(),
  availability: z.string().nullish(),
});

export const applicationSchema = z.object({
  jobId: z.string().min(6, "Invalid job"),
  note: z.string().min(10, "Note: at least 10 characters"),
  resume: resumeSchema,
  details: detailsSchema,
});

export const stageSchema = z.object({
  stage: z.enum(applicationStages),
  details: z.record(z.unknown()).optional().nullable(),
});
