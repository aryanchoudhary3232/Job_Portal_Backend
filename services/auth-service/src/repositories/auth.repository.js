import { prisma } from "../config/db.js";

export const findUserByEmail = async (email) =>
  prisma.user.findUnique({ where: { email: email.toLowerCase() } });

export const findUserById = async (id) =>
  prisma.user.findUnique({ where: { id } });

export const findUserByProvider = async (provider, providerId) =>
  prisma.user.findUnique({
    where: {
      oauthProvider_oauthProviderId: {
        oauthProvider: provider,
        oauthProviderId: providerId,
      },
    },
  });

export const createUser = async (user) => prisma.user.create({ data: user });

export const updateUser = async (id, updates) =>
  prisma.user.update({ where: { id }, data: updates });

export const findUserByVerificationToken = async (token) =>
  prisma.user.findFirst({ where: { emailVerificationToken: token } });
