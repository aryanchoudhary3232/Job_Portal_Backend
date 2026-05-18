import { asyncHandler } from "../../../../shared/src/http/async-handler.js";
import { created, ok } from "../../../../shared/src/http/responses.js";
import { getCurrentUser, loginUser, registerUser } from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  created(res, registerUser(req.body), "Registration successful");
});

export const login = asyncHandler(async (req, res) => {
  ok(res, loginUser(req.body), "Login successful");
});

export const me = asyncHandler(async (req, res) => {
  ok(res, getCurrentUser(req.headers["x-user-id"]), "Current user");
});
