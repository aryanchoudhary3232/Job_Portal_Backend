import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { AppError } from "./errors.js";

export const createApp = (name) => {
  const app = express();
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
  app.use(helmet());
  app.use(express.json());
  app.use(morgan(`${name} :method :url :status :response-time ms`));
  app.get("/health", (_req, res) => res.json({ success: true, service: name }));
  return app;
};

export const attachErrorHandler = (app) => {
  app.use((error, _req, res, _next) => {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
      details: error.details,
    });
  });
};
