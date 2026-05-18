import { z } from "zod";
import { roles } from "../../../../shared/src/domain/constants.js";

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum([roles.student, roles.recruiter, roles.staff]),
  location: z.string().optional(),
  companyName: z.string().optional(),
  college: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
