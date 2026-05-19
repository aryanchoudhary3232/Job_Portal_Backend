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
} from "../repositories/auth.repository.js";

const sanitize = ({ passwordHash, ...user }) => user;

export const registerUser = async (payload) => {
  const email = payload.email.toLowerCase();
  const existing = await findUserByEmail(email);
  ensure(!existing, 409, "An account with this email already exists");
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
    college: payload.college || "",
    phone: payload.phone || "",
    verificationStatus:
      payload.role === roles.recruiter ? verificationStates[0] : undefined,
  };
  const savedUser = await createUser(user);
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
