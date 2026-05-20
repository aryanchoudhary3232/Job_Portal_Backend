import {
  roles,
  verificationStates,
} from "../../../../shared/src/domain/constants.js";
import { ensure } from "../../../../shared/src/http/errors.js";
import {
  findUserById,
  listUsers,
  updateUser,
} from "../repositories/user.repository.js";

const sanitize = ({ passwordHash, emailVerificationToken, ...user }) => user;

export const getProfile = async (userId) => {
  const user = await findUserById(userId);
  ensure(user, 404, "User not found");
  return sanitize(user);
};

export const saveProfile = async (userId, patch) => {
  const currentUser = await findUserById(userId);
  ensure(currentUser, 404, "User not found");
  return sanitize(await updateUser(userId, { ...patch }));
};

export const getTalentPool = async (query = "") => {
  const users = await listUsers();
  return users
    .filter((user) => user.role === roles.student)
    .filter((user) =>
      `${user.fullName} ${user.skills?.join(" ")}`
        .toLowerCase()
        .includes(String(query).toLowerCase()),
    )
    .map(sanitize);
};

export const getPendingRecruiters = async () => {
  const users = await listUsers();
  return users
    .filter(
      (user) =>
        user.role === roles.recruiter &&
        user.verificationStatus === verificationStates[0],
    )
    .map(sanitize);
};

export const updateRecruiterVerification = async (id, status) => {
  const user = await findUserById(id);
  ensure(user?.role === roles.recruiter, 404, "Recruiter not found");
  return sanitize(await updateUser(id, { verificationStatus: status }));
};
