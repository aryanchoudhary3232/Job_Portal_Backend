import { asyncHandler } from "../../../../shared/src/http/async-handler.js";
import { created, ok } from "../../../../shared/src/http/responses.js";
import {
  browseJobs,
  postJob,
  recruiterAnalytics,
  recruiterJobs,
  updateJobStatus,
} from "../services/job.service.js";

export const list = asyncHandler(async (req, res) =>
  ok(res, await browseJobs(req.query), "Jobs fetched"),
);
export const create = asyncHandler(async (req, res) =>
  created(
    res,
    await postJob(req.headers["x-user-id"], req.body),
    "Job created",
  ),
);
export const mine = asyncHandler(async (req, res) =>
  ok(res, await recruiterJobs(req.headers["x-user-id"]), "Recruiter jobs"),
);
export const analytics = asyncHandler(async (req, res) =>
  ok(
    res,
    await recruiterAnalytics(req.headers["x-user-id"]),
    "Recruiter analytics",
  ),
);
export const updateStatus = asyncHandler(async (req, res) =>
  ok(
    res,
    await updateJobStatus(
      req.params.id,
      req.headers["x-user-id"],
      req.body.status,
    ),
    "Job updated",
  ),
);
