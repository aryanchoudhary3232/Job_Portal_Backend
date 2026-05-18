import { Router } from "express";
import { requireAuth, requireRole } from "../../../../shared/src/http/auth.js";
import { validate } from "../../../../shared/src/http/validate.js";
import { analytics, create, list, mine, updateStatus } from "../controllers/job.controller.js";
import { jobSchema, jobStatusSchema } from "../validators/job.validator.js";

const router = Router();

router.get("/", list);
router.get("/recruiter/me", requireAuth, requireRole("RECRUITER"), mine);
router.get("/recruiter/analytics", requireAuth, requireRole("RECRUITER"), analytics);
router.post("/", requireAuth, requireRole("RECRUITER"), validate(jobSchema), create);
router.patch("/:id/status", requireAuth, requireRole("RECRUITER"), validate(jobStatusSchema), updateStatus);

export default router;
