import { randomUUID } from "node:crypto";

export const createId = (prefix) => `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
