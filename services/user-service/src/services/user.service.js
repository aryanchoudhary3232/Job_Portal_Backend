import { roles, verificationStates } from "../../../../shared/src/domain/constants.js";
import { ensure } from "../../../../shared/src/http/errors.js";
import { findUserById, listUsers, updateUser } from "../repositories/user.repository.js";

const sanitize = ({ passwordHash, ...user }) => user;

export const getProfile = (userId) => {
  const user = findUserById(userId);
  ensure(user, 404, "User not found");
  return sanitize(user);
};

export const saveProfile = (userId, patch) => {
  const currentUser = findUserById(userId);
  ensure(currentUser, 404, "User not found");
  return sanitize(updateUser(userId, { ...currentUser, ...patch }));
};

export const getTalentPool = (query = "") =>
  listUsers()
    .filter((user) => user.role === roles.student)
    .filter((user) => `${user.fullName} ${user.skills?.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
    .map(sanitize);

export const getPendingRecruiters = () =>
  listUsers()
    .filter((user) => user.role === roles.recruiter && user.verificationStatus === verificationStates[0])
    .map(sanitize);

export const updateRecruiterVerification = (id, status) => {
  const user = findUserById(id);
  ensure(user?.role === roles.recruiter, 404, "Recruiter not found");
  return sanitize(updateUser(id, { verificationStatus: status }));
};
