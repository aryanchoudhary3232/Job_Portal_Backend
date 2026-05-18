import { ensure } from "../../../../shared/src/http/errors.js";
import { createId } from "../../../../shared/src/utils/ids.js";
import { createJob, findJobById, listJobs, updateJob } from "../repositories/job.repository.js";

export const browseJobs = (filters = {}) =>
  listJobs().filter((job) => {
    const matchesQuery = !filters.q || `${job.title} ${job.companyName} ${job.skills.join(" ")}`.toLowerCase().includes(String(filters.q).toLowerCase());
    const matchesMode = !filters.workMode || job.workMode === filters.workMode;
    return matchesQuery && matchesMode;
  });

export const postJob = (recruiterId, payload) =>
  createJob({
    id: createId("job"),
    recruiterId,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    ...payload,
  });

export const recruiterJobs = (recruiterId) => listJobs().filter((job) => job.recruiterId === recruiterId);

export const updateJobStatus = (jobId, recruiterId, status) => {
  const job = findJobById(jobId);
  ensure(job, 404, "Job not found");
  ensure(job.recruiterId === recruiterId, 403, "This job does not belong to you");
  return updateJob(jobId, { status });
};

export const recruiterAnalytics = (recruiterId) => {
  const jobs = recruiterJobs(recruiterId);
  return {
    activeJobs: jobs.filter((job) => job.status === "PUBLISHED").length,
    pausedJobs: jobs.filter((job) => job.status === "PAUSED").length,
    draftJobs: jobs.filter((job) => job.status === "DRAFT").length,
    topSkills: [...new Set(jobs.flatMap((job) => job.skills))].slice(0, 6),
  };
};
