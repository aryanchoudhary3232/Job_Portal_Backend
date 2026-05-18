import { asyncHandler } from "../../../../shared/src/http/async-handler.js";
import { ok } from "../../../../shared/src/http/responses.js";
import { getAnalytics, getOverview } from "../services/admin.service.js";

export const overview = asyncHandler(async (_req, res) => ok(res, getOverview(), "Admin overview"));
export const analytics = asyncHandler(async (_req, res) => ok(res, getAnalytics(), "Admin analytics"));
