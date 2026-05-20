import {
  roles,
  verificationStates,
} from "../../../../shared/src/domain/constants.js";
import { ensure } from "../../../../shared/src/http/errors.js";
import { signToken } from "../../../../shared/src/auth/token.js";
import { createId } from "../../../../shared/src/utils/ids.js";
import {
  hashPassword,
  verifyPassword,
} from "../../../../shared/src/utils/password.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByVerificationToken,
  updateUser,
} from "../repositories/auth.repository.js";
import { sendVerificationEmail } from "./email.service.js";

const sanitize = ({ passwordHash, emailVerificationToken, ...user }) => user;

export const registerUser = async (payload) => {
  const email = payload.email.toLowerCase();
  const existing = await findUserByEmail(email);
  ensure(!existing, 409, "An account with this email already exists");
  
  const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

  const user = {
    id: createId("usr"),
    fullName: payload.fullName,
    email,
    passwordHash: hashPassword(payload.password),
    role: payload.role,
    headline:
      payload.role === roles.student
        ? "Early career candidate"
        : "Hiring partner",
    location: payload.location || "India",
    bio: payload.bio || "Profile is being completed.",
    skills: payload.skills || [],
    companyName: payload.companyName || "",
    companyType: payload.companyType || "",
    employeeRange: payload.employeeRange || "",
    college: payload.college || "",
    phone: payload.phone || "",
    verificationStatus:
      payload.role === roles.recruiter ? verificationStates[0] : undefined,
    isEmailVerified: payload.isEmailVerified || false,
    emailVerificationToken: verificationToken,
  };

  const savedUser = await createUser(user);

  // Send email in the background only if not already verified
  if (!user.isEmailVerified) {
    sendVerificationEmail(savedUser.email, verificationToken, savedUser.fullName)
      .catch((err) => console.error("Error sending verification email in registerUser:", err));
  }

  return { accessToken: signToken(savedUser), user: sanitize(savedUser) };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email.toLowerCase());
  ensure(user, 401, "Invalid email or password");
  ensure(user.passwordHash, 401, "Use Google or GitHub to sign in");
  ensure(
    verifyPassword(password, user.passwordHash),
    401,
    "Invalid email or password",
  );
  return { accessToken: signToken(user), user: sanitize(user) };
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);
  ensure(user, 404, "User not found");
  return sanitize(user);
};

export const verifyEmailToken = async (token) => {
  const user = await findUserByVerificationToken(token);
  ensure(user, 400, "Invalid or expired email verification link.");
  
  await updateUser(user.id, {
    isEmailVerified: true,
    emailVerificationToken: null,
  });

  return user;
};

export const verifyEmailOtp = async (email, code) => {
  const user = await findUserByEmail(email.toLowerCase());
  ensure(user, 404, "User not found");
  ensure(user.emailVerificationToken === code.toString(), 400, "Invalid or expired email verification OTP.");

  const updated = await updateUser(user.id, {
    isEmailVerified: true,
    emailVerificationToken: null,
  });

  return sanitize(updated);
};
