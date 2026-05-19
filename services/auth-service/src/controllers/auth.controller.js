import { asyncHandler } from "../../../../shared/src/http/async-handler.js";
import { created, ok } from "../../../../shared/src/http/responses.js";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  created(res, result, "Registration successful");
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  ok(res, result, "Login successful");
});

export const me = asyncHandler(async (req, res) => {
  const result = await getCurrentUser(req.headers["x-user-id"]);
  ok(res, result, "Current user");
});
