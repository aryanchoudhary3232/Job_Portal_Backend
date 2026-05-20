import { applicationStages } from "../../../../shared/src/domain/constants.js";
import { ensure } from "../../../../shared/src/http/errors.js";
import { createId } from "../../../../shared/src/utils/ids.js";
import { prisma } from "../../../auth-service/src/config/db.js";
import {
  createApplication,
  findApplicationById,
  findApplicationByJobAndStudent,
  listApplicationsByRecruiter,
  listApplicationsByStudent,
  updateApplication,
} from "../repositories/application.repository.js";

export const applyToJob = async (studentId, payload) => {
  const job = await prisma.job.findUnique({ where: { id: payload.jobId } });
  ensure(job, 404, "Job not found");
  ensure(job.status === "PUBLISHED", 400, "Job is not accepting applications");
  const existing = await findApplicationByJobAndStudent(
    payload.jobId,
    studentId,
  );
  ensure(!existing, 409, "Application already exists");
  return createApplication({
    id: createId("app"),
    jobId: job.id,
    recruiterId: job.recruiterId,
    studentId,
    stage: applicationStages[0],
    note: payload.note,
    resumeFileName: payload.resume.fileName,
    resumeMimeType: payload.resume.mimeType,
    resumeData: payload.resume.data,
    details: payload.details,
  });
};

export const studentApplications = async (studentId) =>
  listApplicationsByStudent(studentId);

export const recruiterApplications = async (recruiterId) =>
  listApplicationsByRecruiter(recruiterId);

export const changeApplicationStage = async (id, recruiterId, stage) => {
  const application = await findApplicationById(id);
  ensure(application, 404, "Application not found");
  ensure(
    application.recruiterId === recruiterId,
    403,
    "This application does not belong to you",
  );
  return updateApplication(id, { stage });
};
