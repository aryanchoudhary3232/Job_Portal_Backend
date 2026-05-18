import { z } from "zod";
import { verificationStates } from "../../../../shared/src/domain/constants.js";

export const profileSchema = z.object({
  fullName: z.string().min(2).optional(),
  headline: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  bio: z.string().min(10).optional(),
  college: z.string().optional(),
  companyName: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export const verificationSchema = z.object({
  status: z.enum([verificationStates[1], verificationStates[2]]),
});
