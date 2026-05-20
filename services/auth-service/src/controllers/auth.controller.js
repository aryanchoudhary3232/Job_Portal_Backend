import { asyncHandler } from "../../../../shared/src/http/async-handler.js";
import { created, ok } from "../../../../shared/src/http/responses.js";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  verifyEmailToken,
} from "../services/auth.service.js";
import { generateAndSendOtp, verifyOtpCode, generateAndSendEmailOtp, verifyEmailOtpCode } from "../services/otp.service.js";

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

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  await verifyEmailToken(token);
  
  const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
  res.redirect(`${frontendOrigin}/login?email_verified=true`);
});

export const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const result = await generateAndSendOtp(phone);
  ok(res, result, "OTP sent successfully");
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;
  const result = await verifyOtpCode(phone, code);
  ok(res, result, "OTP verified successfully");
});

export const sendEmailOtp = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;
  const result = await generateAndSendEmailOtp(email, fullName);
  ok(res, result, "Email OTP sent successfully");
});

export const verifyEmailOtp = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const result = await verifyEmailOtpCode(email, code);
  ok(res, result, "Email verified successfully");
});
