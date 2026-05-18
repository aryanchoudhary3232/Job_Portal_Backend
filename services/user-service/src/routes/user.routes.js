import { Router } from "express";
import { requireAuth, requireRole } from "../../../../shared/src/http/auth.js";
import { validate } from "../../../../shared/src/http/validate.js";
import { me, pendingRecruiters, talent, updateMe, verifyRecruiter } from "../controllers/user.controller.js";
import { profileSchema, verificationSchema } from "../validators/user.validator.js";

const router = Router();

router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, validate(profileSchema), updateMe);
router.get("/talent", requireAuth, talent);
router.get("/recruiters/pending", requireAuth, requireRole("STAFF"), pendingRecruiters);
router.patch("/recruiters/:id/verification", requireAuth, requireRole("STAFF"), validate(verificationSchema), verifyRecruiter);

export default router;
