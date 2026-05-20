import { prisma } from "../../../auth-service/src/config/db.js";

export const listJobs = async (filters = {}) =>
  prisma.job.findMany({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.recruiterId ? { recruiterId: filters.recruiterId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

export const findJobById = async (id) =>
  prisma.job.findUnique({ where: { id } });

export const createJob = async (job) => prisma.job.create({ data: job });

export const updateJob = async (id, patch) =>
  prisma.job.update({ where: { id }, data: patch });
