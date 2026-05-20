import { prisma } from "../../../auth-service/src/config/db.js";

export const createApplication = async (application) =>
  prisma.application.create({ data: application });

export const updateApplication = async (id, patch) =>
  prisma.application.update({ where: { id }, data: patch });

export const findApplicationById = async (id) =>
  prisma.application.findUnique({ where: { id } });

export const findApplicationByJobAndStudent = async (jobId, studentId) =>
  prisma.application.findUnique({
    where: { jobId_studentId: { jobId, studentId } },
  });

export const listApplicationsByStudent = async (studentId) =>
  prisma.application.findMany({
    where: { studentId },
    include: { job: true, student: true },
    orderBy: { appliedAt: "desc" },
  });

export const listApplicationsByRecruiter = async (recruiterId) =>
  prisma.application.findMany({
    where: { recruiterId },
    include: { job: true, student: true },
    orderBy: { appliedAt: "desc" },
  });
