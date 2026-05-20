import {
  applicationStages,
  roles,
  verificationStates,
  workModes,
} from "../../../../shared/src/domain/constants.js";
import { prisma } from "../../../auth-service/src/config/db.js";

export const getOverview = async () => {
  const [
    totalStudents,
    totalRecruiters,
    totalJobs,
    totalApplications,
    pendingRecruiters,
    totalShortlisted,
    totalSelected,
    totalRejected,
  ] = await Promise.all([
    prisma.user.count({ where: { role: roles.student } }),
    prisma.user.count({ where: { role: roles.recruiter } }),
    prisma.job.count(),
    prisma.application.count(),
    prisma.user.count({
      where: {
        role: roles.recruiter,
        verificationStatus: verificationStates[0],
      },
    }),
    prisma.application.count({ where: { stage: "SHORTLISTED" } }),
    prisma.application.count({ where: { stage: "HIRED" } }),
    prisma.application.count({ where: { stage: "REJECTED" } }),
  ]);

  return {
    totalStudents,
    totalRecruiters,
    totalJobs,
    totalApplications,
    pendingRecruiters,
    totalShortlisted,
    totalSelected,
    totalRejected,
  };
};

export const getAnalytics = async () => {
  const jobsByMode = await Promise.all(
    workModes.map(async (mode) => ({
      label: mode,
      value: await prisma.job.count({ where: { workMode: mode } }),
    })),
  );

  const applicationsByStage = await Promise.all(
    applicationStages.map(async (stage) => ({
      label: stage,
      value: await prisma.application.count({ where: { stage } }),
    })),
  );

  return { jobsByMode, applicationsByStage };
};

export const listApplications = async () =>
  prisma.application.findMany({
    include: { job: true, student: true, recruiter: true },
    orderBy: { appliedAt: "desc" },
  });
