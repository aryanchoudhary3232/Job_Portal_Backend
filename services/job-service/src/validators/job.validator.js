import { z } from "zod";
import { jobStates, workModes } from "../../../../shared/src/domain/constants.js";

export const jobSchema = z.object({
  title: z.string().min(3, "Job title: at least 3 characters"),
  companyName: z.string().min(2, "Company: at least 2 characters"),
  location: z.string().min(2, "Location: at least 2 characters"),
  workMode: z.enum(workModes, { message: "Work mode: choose Remote, Hybrid, or Onsite" }),
  type: z.string().min(2, "Job type: at least 2 characters"),
  salaryRange: z.string().min(2, "Salary: at least 2 characters"),
  skills: z.array(z.string()).min(1, "Skills: add at least one (comma separated)"),
  description: z.string().min(20, "Description: at least 20 characters"),
});

export const jobStatusSchema = z.object({
  status: z.enum(jobStates),
});
