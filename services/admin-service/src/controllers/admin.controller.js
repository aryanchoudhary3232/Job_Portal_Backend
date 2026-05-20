import { asyncHandler } from "../../../../shared/src/http/async-handler.js";
import { ok } from "../../../../shared/src/http/responses.js";
import {
  getAnalytics,
  getOverview,
  listApplications,
} from "../services/admin.service.js";

export const overview = asyncHandler(async (_req, res) =>
  ok(res, await getOverview(), "Admin overview"),
);
export const analytics = asyncHandler(async (_req, res) =>
  ok(res, await getAnalytics(), "Admin analytics"),
);
export const applications = asyncHandler(async (_req, res) =>
  ok(res, await listApplications(), "Applications"),
);
