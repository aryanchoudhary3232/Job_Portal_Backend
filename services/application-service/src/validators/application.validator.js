import { z } from "zod";
import { applicationStages } from "../../../../shared/src/domain/constants.js";

export const applicationSchema = z.object({
  jobId: z.string().min(6),
  note: z.string().min(10),
});

export const stageSchema = z.object({
  stage: z.enum(applicationStages),
});
