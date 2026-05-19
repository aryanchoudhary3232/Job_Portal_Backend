import { asyncHandler } from "../../../../shared/src/http/async-handler.js";
import {
  buildOAuthUrl,
  buildClientRedirect,
  handleOAuthCallback,
} from "../services/oauth.service.js";

export const startGoogleOAuth = asyncHandler(async (_req, res) => {
  const { url } = buildOAuthUrl("google");
  res.redirect(url);
});

export const startGithubOAuth = asyncHandler(async (_req, res) => {
  const { url } = buildOAuthUrl("github");
  res.redirect(url);
});

export const googleCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  if (typeof code !== "string" || typeof state !== "string") {
    res.status(400).json({ success: false, message: "Invalid OAuth callback" });
    return;
  }
  const result = await handleOAuthCallback({ provider: "google", code, state });
  res.redirect(buildClientRedirect(result));
});

export const githubCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  if (typeof code !== "string" || typeof state !== "string") {
    res.status(400).json({ success: false, message: "Invalid OAuth callback" });
    return;
  }
  const result = await handleOAuthCallback({ provider: "github", code, state });
  res.redirect(buildClientRedirect(result));
});
