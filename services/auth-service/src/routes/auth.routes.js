import { Router } from "express";
import { requireAuth } from "../../../../shared/src/http/auth.js";
import { validate } from "../../../../shared/src/http/validate.js";
import { login, me, register } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, me);

export default router;
