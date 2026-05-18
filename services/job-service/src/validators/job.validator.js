import { z } from "zod";
import { jobStates, workModes } from "../../../../shared/src/domain/constants.js";

export const jobSchema = z.object({
  title: z.string().min(3),
  companyName: z.string().min(2),
  location: z.string().min(2),
  workMode: z.enum(workModes),
  type: z.string().min(2),
  salaryRange: z.string().min(2),
  skills: z.array(z.string()).min(1),
  description: z.string().min(20),
});

export const jobStatusSchema = z.object({
  status: z.enum(jobStates),
});
