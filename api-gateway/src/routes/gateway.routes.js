import { Router } from "express";
import { asyncHandler } from "../../../shared/src/http/async-handler.js";
import { serviceTargets } from "../../../shared/src/config/services.js";
import { AppError } from "../../../shared/src/http/errors.js";
import { enrichHeaders } from "../auth-context.js";
import { proxyRequest } from "../proxy.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, services: serviceTargets });
});

router.use("/:service", asyncHandler(async (req, res) => {
  if (!serviceTargets[req.params.service]) {
    throw new AppError(404, "Service route not found");
  }
  const headers = enrichHeaders(req);
  await proxyRequest(req, res, headers);
}));

export default router;
