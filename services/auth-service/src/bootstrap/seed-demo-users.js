import { prisma } from "../config/db.js";
import { roles, verificationStates } from "../../../../shared/src/domain/constants.js";
import { createId } from "../../../../shared/src/utils/ids.js";
import { hashPassword } from "../../../../shared/src/utils/password.js";

const demoAccounts = [
  {
    email: "staff@demo.com",
    password: "Password123",
    role: roles.staff,
    fullName: "Platform Admin",
    headline: "Operations administrator",
    location: "India",
    bio: "Platform operations and oversight.",
    isEmailVerified: true,
  },
  {
    email: "student@demo.com",
    password: "Password123",
    role: roles.student,
    fullName: "Aarav Mehta",
    headline: "Final-year full-stack engineer",
    location: "Bengaluru",
    college: "IIT Delhi",
    skills: ["React", "Node.js", "TypeScript"],
    bio: "Building polished products with strong backend fundamentals.",
    isEmailVerified: true,
  },
  {
    email: "recruiter@demo.com",
    password: "Password123",
    role: roles.recruiter,
    fullName: "Mira Kapoor",
    headline: "Talent acquisition lead",
    location: "Mumbai",
    companyName: "Orbit Labs",
    verificationStatus: verificationStates[1],
    bio: "Hiring engineers for platform and product teams.",
    isEmailVerified: true,
  },
];

export const seedDemoUsers = async () => {
  for (const account of demoAccounts) {
    const email = account.email.toLowerCase();
    const passwordHash = hashPassword(account.password);

    await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: account.role,
        fullName: account.fullName,
        headline: account.headline,
        location: account.location,
        bio: account.bio,
        skills: account.skills ?? [],
        college: account.college ?? null,
        companyName: account.companyName ?? null,
        verificationStatus: account.verificationStatus ?? null,
        isEmailVerified: account.isEmailVerified,
      },
      create: {
        id: createId("usr"),
        email,
        passwordHash,
        role: account.role,
        fullName: account.fullName,
        headline: account.headline,
        location: account.location,
        bio: account.bio,
        skills: account.skills ?? [],
        college: account.college ?? null,
        companyName: account.companyName ?? null,
        verificationStatus: account.verificationStatus ?? null,
        isEmailVerified: account.isEmailVerified,
      },
    });
  }
};
