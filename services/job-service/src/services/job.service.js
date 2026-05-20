import { ensure } from "../../../../shared/src/http/errors.js";
import { createId } from "../../../../shared/src/utils/ids.js";
import {
  createJob,
  findJobById,
  listJobs,
  updateJob,
} from "../repositories/job.repository.js";

export const browseJobs = async (filters = {}) => {
  const jobs = await listJobs({ status: "PUBLISHED" });
  return jobs.filter((job) => {
    const matchesQuery =
      !filters.q ||
      `${job.title} ${job.companyName} ${job.skills.join(" ")}`
        .toLowerCase()
        .includes(String(filters.q).toLowerCase());
    const matchesMode = !filters.workMode || job.workMode === filters.workMode;
    return matchesQuery && matchesMode;
  });
};

export const postJob = async (recruiterId, payload) =>
  createJob({
    id: createId("job"),
    recruiterId,
    status: "PUBLISHED",
    ...payload,
  });

export const recruiterJobs = async (recruiterId) => listJobs({ recruiterId });

export const updateJobStatus = async (jobId, recruiterId, status) => {
  const job = await findJobById(jobId);
  ensure(job, 404, "Job not found");
  ensure(
    job.recruiterId === recruiterId,
    403,
    "This job does not belong to you",
  );
  return updateJob(jobId, { status });
};

export const recruiterAnalytics = async (recruiterId) => {
  const jobs = await recruiterJobs(recruiterId);
  return {
    activeJobs: jobs.filter((job) => job.status === "PUBLISHED").length,
    pausedJobs: jobs.filter((job) => job.status === "PAUSED").length,
    draftJobs: jobs.filter((job) => job.status === "DRAFT").length,
    topSkills: [...new Set(jobs.flatMap((job) => job.skills))].slice(0, 6),
  };
};
