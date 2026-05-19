import { Router } from "express";
import { requireAuth } from "../../../../shared/src/http/auth.js";
import { validate } from "../../../../shared/src/http/validate.js";
import { login, me, register } from "../controllers/auth.controller.js";
import {
  githubCallback,
  googleCallback,
  startGithubOAuth,
  startGoogleOAuth,
} from "../controllers/oauth.controller.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/oauth/google", startGoogleOAuth);
router.get("/oauth/google/callback", googleCallback);
router.get("/oauth/github", startGithubOAuth);
router.get("/oauth/github/callback", githubCallback);
router.get("/me", requireAuth, me);

export default router;
