import { createId } from "../utils/ids.js";
import { hashPassword } from "../utils/password.js";
import { applicationStages, roles, verificationStates } from "../domain/constants.js";

const recruiterId = createId("usr");
const studentId = createId("usr");
const staffId = createId("usr");
const jobId = createId("job");

export const defaultData = {
  users: [
    {
      id: studentId,
      fullName: "Aarav Mehta",
      email: "student@demo.com",
      passwordHash: hashPassword("Password123"),
      role: roles.student,
      headline: "Final-year full-stack engineer",
      location: "Bengaluru",
      college: "IIT Delhi",
      skills: ["React", "Node.js", "TypeScript", "System Design"],
      bio: "Building polished products with strong backend fundamentals.",
    },
    {
      id: recruiterId,
      fullName: "Mira Kapoor",
      email: "recruiter@demo.com",
      passwordHash: hashPassword("Password123"),
      role: roles.recruiter,
      headline: "Talent acquisition lead",
      location: "Mumbai",
      companyName: "Orbit Labs",
      verificationStatus: verificationStates[1],
      bio: "Hiring engineers for platform and product teams.",
    },
    {
      id: staffId,
      fullName: "Sana Verma",
      email: "staff@demo.com",
      passwordHash: hashPassword("Password123"),
      role: roles.staff,
      headline: "Platform operations manager",
      location: "Pune",
      bio: "Keeps the marketplace trusted and operational.",
    },
  ],
  jobs: [
    {
      id: jobId,
      title: "Frontend Engineer",
      companyName: "Orbit Labs",
      location: "Bengaluru",
      workMode: "HYBRID",
      type: "Full-time",
      salaryRange: "12-18 LPA",
      skills: ["React", "Next.js", "Design Systems"],
      description: "Own UX quality across student-facing growth funnels.",
      recruiterId,
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
    },
  ],
  applications: [
    {
      id: createId("app"),
      jobId,
      studentId,
      recruiterId,
      stage: applicationStages[1],
      note: "Strong UI craft, shortlisted for screening.",
      appliedAt: new Date().toISOString(),
    },
  ],
};
