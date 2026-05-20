import { verifyToken } from "../../shared/src/auth/token.js";
import { AppError } from "../../shared/src/http/errors.js";

export const enrichHeaders = (req) => {
  const headers = new Headers();
  ["content-type", "accept", "user-agent"].forEach((key) => {
    const value = req.headers[key];
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(",") : String(value));
    }
  });
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return headers;
  }
  const token = authHeader.slice(7);
  let payload;
  try {
    payload = verifyToken(token);
    headers.set("x-user-id", String(payload.sub));
    headers.set("x-user-role", String(payload.role));
    headers.set("x-user-email", String(payload.email));
  } catch (err) {
    console.warn("[Gateway Auth] Stale or invalid bearer token supplied, ignoring:", err.message);
  }
  return headers;
};
