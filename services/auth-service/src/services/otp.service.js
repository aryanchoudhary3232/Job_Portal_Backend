import { prisma } from "../config/db.js";
import { sendOtpSms } from "./sms.service.js";
import { sendVerificationEmail } from "./email.service.js";

export const generateAndSendOtp = async (phone) => {
  if (!phone) {
    throw new Error("Phone number is required");
  }

  // Clean phone input (remove non-digits)
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 10) {
    throw new Error("Invalid phone number format");
  }

  // Generate a random 4-digit code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

  // Save/Update in database using OtpVerification model
  await prisma.otpVerification.upsert({
    where: { phone: cleanPhone },
    update: {
      code,
      expiresAt,
      createdAt: new Date(),
    },
    create: {
      phone: cleanPhone,
      code,
      expiresAt,
    },
  });

  // Dispatch OTP via SMS service
  const smsResult = await sendOtpSms(cleanPhone, code);

  if (!smsResult.success) {
    console.error("Failed to send SMS, falling back to mock OTP for testing.");
    return {
      success: true,
      message: "Fast2SMS rejected the request. Falling back to Mock OTP.",
      code, // Always return code if SMS fails so they can continue testing
    };
  }

  return {
    success: true,
    message: "OTP sent successfully",
    // ONLY send code back in API response if FAST2SMS_API_KEY is not defined, for easy local sandbox testing!
    ...(process.env.FAST2SMS_API_KEY ? {} : { code }),
  };
};

export const verifyOtpCode = async (phone, code) => {
  if (!phone || !code) {
    throw new Error("Phone number and OTP code are required");
  }

  const cleanPhone = phone.replace(/\D/g, "");

  const record = await prisma.otpVerification.findUnique({
    where: { phone: cleanPhone },
  });

  if (!record) {
    throw new Error("OTP verification record not found");
  }

  if (new Date() > record.expiresAt) {
    await prisma.otpVerification.delete({ where: { phone: cleanPhone } }).catch(() => {});
    throw new Error("OTP code has expired");
  }

  if (record.code !== code.toString()) {
    throw new Error("Invalid OTP code");
  }

  // Success! Delete OTP record so it cannot be reused
  await prisma.otpVerification.delete({ where: { phone: cleanPhone } }).catch(() => {});

  return { success: true };
};

export const generateAndSendEmailOtp = async (email, name) => {
  if (!email) {
    throw new Error("Email address is required");
  }

  const cleanEmail = email.toLowerCase().trim();
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits for email
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await prisma.otpVerification.upsert({
    where: { phone: cleanEmail },
    update: {
      code,
      expiresAt,
      createdAt: new Date(),
    },
    create: {
      phone: cleanEmail,
      code,
      expiresAt,
    },
  });

  // Send gorgeous email via Resend
  const emailResult = await sendVerificationEmail(cleanEmail, code, name || "Recruiter");

  if (emailResult && !emailResult.success) {
    console.error("Failed to send Email, falling back to mock OTP for testing.");
    return {
      success: true,
      message: "Resend rejected the request. Falling back to Mock OTP.",
      code, // Always return code if Email fails so they can continue testing
    };
  }

  return {
    success: true,
    message: "Email verification OTP sent successfully",
    // Return code in dev mode for easy local verification if RESEND_API_KEY is missing
    ...(process.env.RESEND_API_KEY ? {} : { code }),
  };
};

export const verifyEmailOtpCode = async (email, code) => {
  if (!email || !code) {
    throw new Error("Email and OTP code are required");
  }

  const cleanEmail = email.toLowerCase().trim();
  const record = await prisma.otpVerification.findUnique({
    where: { phone: cleanEmail },
  });

  if (!record) {
    throw new Error("Email verification record not found");
  }

  if (new Date() > record.expiresAt) {
    await prisma.otpVerification.delete({ where: { phone: cleanEmail } }).catch(() => {});
    throw new Error("Email verification OTP has expired");
  }

  if (record.code !== code.toString()) {
    throw new Error("Invalid email verification code");
  }

  await prisma.otpVerification.delete({ where: { phone: cleanEmail } }).catch(() => {});

  return { success: true };
};
