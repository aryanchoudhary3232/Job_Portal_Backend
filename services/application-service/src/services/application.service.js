import { applicationStages } from "../../../../shared/src/domain/constants.js";
import { ensure } from "../../../../shared/src/http/errors.js";
import { createId } from "../../../../shared/src/utils/ids.js";
import { createApplication, readPortalState, updateApplication } from "../repositories/application.repository.js";

const withRelations = (application, state) => ({
  ...application,
  job: state.jobs.find((job) => job.id === application.jobId),
  student: state.users.find((user) => user.id === application.studentId),
});

export const applyToJob = (studentId, payload) => {
  const state = readPortalState();
  const job = state.jobs.find((entry) => entry.id === payload.jobId);
  ensure(job, 404, "Job not found");
  ensure(!state.applications.find((entry) => entry.jobId === payload.jobId && entry.studentId === studentId), 409, "Application already exists");
  return createApplication({
    id: createId("app"),
    jobId: job.id,
    recruiterId: job.recruiterId,
    studentId,
    stage: applicationStages[0],
    note: payload.note,
    appliedAt: new Date().toISOString(),
  });
};

export const studentApplications = (studentId) => {
  const state = readPortalState();
  return state.applications.filter((entry) => entry.studentId === studentId).map((entry) => withRelations(entry, state));
};

export const recruiterApplications = (recruiterId) => {
  const state = readPortalState();
  return state.applications.filter((entry) => entry.recruiterId === recruiterId).map((entry) => withRelations(entry, state));
};

export const changeApplicationStage = (id, recruiterId, stage) => {
  const state = readPortalState();
  const application = state.applications.find((entry) => entry.id === id);
  ensure(application, 404, "Application not found");
  ensure(application.recruiterId === recruiterId, 403, "This application does not belong to you");
  return updateApplication(id, { stage });
};
