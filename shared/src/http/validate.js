import { AppError } from "./errors.js";
import { formatZodIssues } from "./zod-errors.js";

export const validate = (schema, part = "body") => (req, _res, next) => {
  const result = schema.safeParse(req[part]);
  if (!result.success) {
    next(new AppError(400, formatZodIssues(result.error.issues)));
    return;
  }
  req[part] = result.data;
  next();
};
