import { roles, verificationStates } from "../../../../shared/src/domain/constants.js";
import { readPortalState } from "../repositories/admin.repository.js";

export const getOverview = () => {
  const state = readPortalState();
  return {
    totalStudents: state.users.filter((user) => user.role === roles.student).length,
    totalRecruiters: state.users.filter((user) => user.role === roles.recruiter).length,
    totalJobs: state.jobs.length,
    totalApplications: state.applications.length,
    pendingRecruiters: state.users.filter((user) => user.verificationStatus === verificationStates[0]).length,
  };
};

export const getAnalytics = () => {
  const state = readPortalState();
  return {
    jobsByMode: ["REMOTE", "HYBRID", "ONSITE"].map((mode) => ({
      label: mode,
      value: state.jobs.filter((job) => job.workMode === mode).length,
    })),
    applicationsByStage: ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"].map((stage) => ({
      label: stage,
      value: state.applications.filter((application) => application.stage === stage).length,
    })),
  };
};
