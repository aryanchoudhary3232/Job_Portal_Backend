import "dotenv/config";
import { applicationStages } from "../../../../shared/src/domain/constants.js";
import { ensure } from "../../../../shared/src/http/errors.js";
import { createId } from "../../../../shared/src/utils/ids.js";
import { prisma } from "../../../auth-service/src/config/db.js";
import {
  createApplication,
  findApplicationById,
  findApplicationByJobAndStudent,
  listApplicationsByRecruiter,
  listApplicationsByStudent,
  updateApplication,
} from "../repositories/application.repository.js";

const sendResendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[Resend Email Mock] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HireVerse Careers <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
    const data = await res.json();
    console.log(`[Resend Email Sent] Status: ${res.status} | To: ${to} | ID: ${data.id || "N/A"}`);
  } catch (err) {
    console.error("[Resend Email Failed]", err);
  }
};

const sendStageEmail = async (appId, stage, details) => {
  try {
    const fullApp = await prisma.application.findUnique({
      where: { id: appId },
      include: { student: true, job: true, recruiter: true },
    });

    if (!fullApp || !fullApp.student?.email) return;

    const studentEmail = fullApp.student.email;
    const studentName = fullApp.student.fullName || "Candidate";
    const jobTitle = fullApp.job?.title || "Role";
    const companyName = fullApp.job?.companyName || "Company";

    if (stage === "SHORTLISTED") {
      await sendResendEmail({
        to: studentEmail,
        subject: `🎉 Application Shortlisted: ${jobTitle} at ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
            <h2 style="color: #6c2bd9; margin-top: 0;">Resume Shortlisted! 🎉</h2>
            <p>Dear <strong>${studentName}</strong>,</p>
            <p>Great news! Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been shortlisted by the recruiter.</p>
            <p style="color: #64748b; font-size: 13px;">Best of luck,<br/>HireVerse Recruitment Team</p>
          </div>
        `,
      });
    } else if (stage === "INTERVIEW") {
      const interviewDate = details?.interviewDate ? new Date(details.interviewDate).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }) : "Scheduled Soon";
      const meetingLink = details?.meetingLink || "https://zoom.us/j/9876543210";
      const notes = details?.interviewNotes || "Technical discussion and role fitment.";

      await sendResendEmail({
        to: studentEmail,
        subject: `📹 Interview Scheduled: ${jobTitle} at ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
            <h2 style="color: #6c2bd9; margin-top: 0;">📹 Interview Scheduled</h2>
            <p>Dear <strong>${studentName}</strong>,</p>
            <p>You have been invited to an interview for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>!</p>
            <div style="background: #faf5ff; border: 1px solid #d8b4fe; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; color: #5b21b6;"><strong>📅 Date & Time:</strong> ${interviewDate}</p>
              <p style="margin: 0 0 8px 0; color: #5b21b6;"><strong>📝 Instructions:</strong> ${notes}</p>
              <div style="margin-top: 16px; text-align: center;">
                <a href="${meetingLink}" target="_blank" style="background: #6c2bd9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; display: inline-block;">
                  🎥 Join Live Zoom Meeting Call
                </a>
              </div>
            </div>
          </div>
        `,
      });
    } else if (stage === "OFFER") {
      const ctc = details?.offerCtc || "As per industry standards";
      const joiningDate = details?.joiningDate || "To be finalized";
      const notes = details?.offerNotes || "Full-time position with complete benefits.";

      await sendResendEmail({
        to: studentEmail,
        subject: `📜 Official Offer Letter: ${jobTitle} at ${companyName} 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 28px; max-width: 600px; margin: 0 auto; border: 2px solid #22c55e; border-radius: 20px; background: #ffffff;">
            <h1 style="color: #15803d; margin: 0;">OFFER LETTER</h1>
            <p>Dear <strong>${studentName}</strong>,</p>
            <p>We are delighted to extend an official job offer for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #166534;"><strong>💰 Compensation (CTC):</strong> ${ctc}</p>
              <p style="margin: 0 0 10px 0; color: #166534;"><strong>📅 Joining Date:</strong> ${joiningDate}</p>
              <p style="margin: 0; color: #166534;"><strong>📜 Terms:</strong> ${notes}</p>
            </div>
          </div>
        `,
      });
    }
  } catch (err) {
    console.error("[Stage Email Notification Error]", err);
  }
};

export const applyToJob = async (studentId, payload) => {
  const job = await prisma.job.findUnique({ where: { id: payload.jobId } });
  ensure(job, 404, "Job not found");
  ensure(job.status === "PUBLISHED", 400, "Job is not accepting applications");
  const existing = await findApplicationByJobAndStudent(
    payload.jobId,
    studentId,
  );
  ensure(!existing, 409, "Application already exists");
  return createApplication({
    id: createId("app"),
    jobId: job.id,
    recruiterId: job.recruiterId,
    studentId,
    stage: applicationStages[0],
    note: payload.note,
    resumeFileName: payload.resume.fileName,
    resumeMimeType: payload.resume.mimeType,
    resumeData: payload.resume.data,
    details: payload.details,
  });
};

export const studentApplications = async (studentId) =>
  listApplicationsByStudent(studentId);

export const recruiterApplications = async (recruiterId) =>
  listApplicationsByRecruiter(recruiterId);

export const changeApplicationStage = async (id, recruiterId, stage, detailsPatch = null) => {
  const application = await findApplicationById(id);
  ensure(application, 404, "Application not found");
  ensure(
    application.recruiterId === recruiterId,
    403,
    "This application does not belong to you",
  );

  const existingDetails = typeof application.details === "object" && application.details !== null ? application.details : {};
  const mergedDetails = detailsPatch ? { ...existingDetails, ...detailsPatch } : existingDetails;

  const updated = await updateApplication(id, { stage, details: mergedDetails });

  // Trigger real Resend Email notification asynchronously
  sendStageEmail(id, stage, mergedDetails).catch((e) => console.error(e));

  return updated;
};
