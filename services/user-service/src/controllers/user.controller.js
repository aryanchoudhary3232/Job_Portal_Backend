import { asyncHandler } from "../../../../shared/src/http/async-handler.js";
import { ok } from "../../../../shared/src/http/responses.js";
import {
  getPendingRecruiters,
  getProfile,
  getTalentPool,
  saveProfile,
  updateRecruiterVerification,
} from "../services/user.service.js";

export const me = asyncHandler(async (req, res) => ok(res, getProfile(req.headers["x-user-id"]), "Profile"));
export const updateMe = asyncHandler(async (req, res) => ok(res, saveProfile(req.headers["x-user-id"], req.body), "Profile updated"));
export const talent = asyncHandler(async (req, res) => ok(res, getTalentPool(req.query.q || ""), "Talent pool"));
export const pendingRecruiters = asyncHandler(async (_req, res) => ok(res, getPendingRecruiters(), "Pending recruiters"));
export const verifyRecruiter = asyncHandler(async (req, res) => ok(res, updateRecruiterVerification(req.params.id, req.body.status), "Recruiter updated"));
