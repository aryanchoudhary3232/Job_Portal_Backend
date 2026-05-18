import { db } from "../../../../shared/src/storage/json-store.js";

export const listJobs = () => db.read().jobs;

export const findJobById = (id) => listJobs().find((job) => job.id === id);

export const createJob = (job) =>
  db.update((state) => {
    state.jobs.unshift(job);
    return state;
  }).jobs.find((entry) => entry.id === job.id);

export const updateJob = (id, patch) =>
  db.update((state) => {
    state.jobs = state.jobs.map((job) => (job.id === id ? { ...job, ...patch } : job));
    return state;
  }).jobs.find((job) => job.id === id);
