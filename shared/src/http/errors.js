export class AppError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const ensure = (condition, statusCode, message, details) => {
  if (!condition) {
    throw new AppError(statusCode, message, details);
  }
};
