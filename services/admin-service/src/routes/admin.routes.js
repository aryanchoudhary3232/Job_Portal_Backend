import { Router } from "express";
import { requireAuth, requireRole } from "../../../../shared/src/http/auth.js";
import {
  analytics,
  applications,
  overview,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/overview", requireAuth, requireRole("STAFF"), overview);
router.get("/analytics", requireAuth, requireRole("STAFF"), analytics);
router.get("/applications", requireAuth, requireRole("STAFF"), applications);

export default router;
