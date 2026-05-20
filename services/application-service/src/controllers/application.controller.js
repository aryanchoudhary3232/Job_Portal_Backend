import { asyncHandler } from "../../../../shared/src/http/async-handler.js";
import { created, ok } from "../../../../shared/src/http/responses.js";
import {
  applyToJob,
  changeApplicationStage,
  recruiterApplications,
  studentApplications,
} from "../services/application.service.js";

export const create = asyncHandler(async (req, res) =>
  created(
    res,
    await applyToJob(req.headers["x-user-id"], req.body),
    "Application submitted",
  ),
);
export const studentList = asyncHandler(async (req, res) =>
  ok(
    res,
    await studentApplications(req.headers["x-user-id"]),
    "Student applications",
  ),
);
export const recruiterList = asyncHandler(async (req, res) =>
  ok(
    res,
    await recruiterApplications(req.headers["x-user-id"]),
    "Recruiter applications",
  ),
);
export const updateStage = asyncHandler(async (req, res) =>
  ok(
    res,
    await changeApplicationStage(
      req.params.id,
      req.headers["x-user-id"],
      req.body.stage,
    ),
    "Application updated",
  ),
);
