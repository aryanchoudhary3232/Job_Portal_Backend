import "dotenv/config";

export const sendOtpSms = async (phone, code) => {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.warn(`[SMS Service Mock] Fast2SMS API key is not configured in .env. Mocking SMS send to +91 ${phone} with code: ${code}`);
    return { success: true, mocked: true };
  }

  console.log(`[SMS Service] Sending actual production OTP via Fast2SMS to +91 ${phone}`);

  try {
    const url = "https://www.fast2sms.com/dev/bulkV2";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "variables_values": code,
        "route": "otp",
        "numbers": phone
      })
    });

    const payload = await response.json();
    
    // Fast2SMS returns HTTP 200 even for logical errors, so we check `payload.return`
    if (!response.ok || payload.return === false || payload.status_code) {
      console.error("Fast2SMS API returned an error:", payload);
      return { success: false, error: payload };
    }

    console.log("Fast2SMS OTP sent successfully!", payload);
    return { success: true, payload };
  } catch (error) {
    console.error("Error sending OTP via Fast2SMS:", error);
    return { success: false, error: error.message };
  }
};
