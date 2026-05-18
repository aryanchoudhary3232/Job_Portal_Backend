import { AppError } from "./errors.js";

export const requireAuth = (req, _res, next) => {
  if (!req.headers["x-user-id"]) {
    next(new AppError(401, "Authentication required"));
    return;
  }
  next();
};

export const requireRole = (...allowedRoles) => (req, _res, next) => {
  if (!allowedRoles.includes(req.headers["x-user-role"])) {
    next(new AppError(403, "You are not allowed to access this resource"));
    return;
  }
  next();
};
