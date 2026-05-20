import { prisma } from "../../../auth-service/src/config/db.js";

export const listUsers = async () => prisma.user.findMany();

export const findUserById = async (id) =>
  prisma.user.findUnique({ where: { id } });

export const updateUser = async (id, patch) =>
  prisma.user.update({ where: { id }, data: patch });
