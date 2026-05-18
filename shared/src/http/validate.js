import { AppError } from "./errors.js";

export const validate = (schema, part = "body") => (req, _res, next) => {
  const result = schema.safeParse(req[part]);
  if (!result.success) {
    next(new AppError(400, result.error.issues.map((issue) => issue.message).join(", ")));
    return;
  }
  req[part] = result.data;
  next();
};
