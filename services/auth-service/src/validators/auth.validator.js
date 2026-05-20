import { z } from "zod";
import { roles } from "../../../../shared/src/domain/constants.js";

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([roles.student, roles.recruiter, roles.staff]),
  phone: z.string().optional(),
  location: z.string().optional(),
  companyName: z.string().optional(),
  companyType: z.string().optional(),
  employeeRange: z.string().optional(),
  college: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  isEmailVerified: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
