import { Router } from "express";
import { requireAuth, requireRole } from "../../../../shared/src/http/auth.js";
import { validate } from "../../../../shared/src/http/validate.js";
import { create, recruiterList, studentList, updateStage } from "../controllers/application.controller.js";
import { applicationSchema, stageSchema } from "../validators/application.validator.js";

const router = Router();

router.post("/", requireAuth, requireRole("STUDENT"), validate(applicationSchema), create);
router.get("/student/me", requireAuth, requireRole("STUDENT"), studentList);
router.get("/recruiter/me", requireAuth, requireRole("RECRUITER"), recruiterList);
router.patch("/:id/stage", requireAuth, requireRole("RECRUITER"), validate(stageSchema), updateStage);

export default router;
