import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const keyLength = 64;

export const hashPassword = (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, keyLength).toString("hex");
  return `${salt}:${hash}`;
};

export const verifyPassword = (password, storedHash) => {
  const [salt, hash] = storedHash.split(":");
  const computed = scryptSync(password, salt, keyLength);
  return timingSafeEqual(computed, Buffer.from(hash, "hex"));
};
