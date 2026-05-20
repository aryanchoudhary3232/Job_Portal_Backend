import "dotenv/config";

export const sendVerificationEmail = async (email, code, name) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Resend API key is not configured. Email verification code is:", code);
    return;
  }

  console.log(`Sending verification OTP to ${email}: ${code}`);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NCRJobs <onboarding@resend.dev>",
        to: [email],
        subject: "Verify Your Email - NCRJobs",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 32px; max-width: 550px; margin: 0 auto; border: 1px solid #f1f0f7; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 30px rgba(108, 43, 217, 0.05);">
            <div style="text-align: center; margin-bottom: 28px;">
              <h2 style="color: #6c2bd9; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">NCRJobs</h2>
              <p style="color: #64748b; font-size: 14px; margin: 6px 0 0 0; font-weight: 600;">Confirm your official email identity</p>
            </div>
            <p style="color: #1e293b; font-size: 16px; line-height: 24px; margin-bottom: 16px; font-weight: 600;">Hello ${name},</p>
            <p style="color: #475569; font-size: 14px; line-height: 22px; margin-bottom: 24px;">Thank you for signing up. Please use the following 6-digit verification code to complete your security onboarding process:</p>
            
            <div style="text-align: center; margin: 28px 0; padding: 20px; background: #faf8ff; border: 1px dashed #c084fc; border-radius: 16px;">
              <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #6c2bd9; font-family: monospace;">${code}</span>
              <p style="color: #94a3b8; font-size: 11px; margin: 8px 0 0 0; font-weight: bold; text-transform: uppercase;">Code expires in 15 minutes</p>
            </div>

            <p style="color: #64748b; font-size: 12px; line-height: 18px;">If you didn't request this code, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #f1f0f7; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 10px; text-align: center; margin: 0; font-weight: 600;">NCRJobs Recruitment Platform &copy; 2026</p>
          </div>
        `,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      console.error("Failed to send verification OTP via Resend:", payload);
      return { success: false, error: payload };
    } else {
      console.log("Verification email with OTP sent successfully:", payload);
      return { success: true };
    }
  } catch (error) {
    console.error("Error sending verification OTP via Resend:", error);
    return { success: false, error: error.message };
  }
};
