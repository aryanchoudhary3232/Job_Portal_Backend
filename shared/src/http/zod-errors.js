const FIELD_LABELS = {
  title: "Job title",
  companyName: "Company",
  location: "Location",
  workMode: "Work mode",
  type: "Job type",
  salaryRange: "Salary",
  skills: "Skills",
  description: "Description",
  note: "Note",
  phone: "Phone",
  resume: "Resume",
  fileName: "Resume file",
  mimeType: "Resume type",
  data: "Resume file",
  jobId: "Job",
  fullName: "Name",
  email: "Email",
  password: "Password",
  headline: "Headline",
  bio: "Bio",
};

const formatIssue = (issue) => {
  const key = issue.path?.[issue.path.length - 1];
  const label = (key && FIELD_LABELS[key]) || (key ? String(key) : "Field");

  if (issue.code === "too_small") {
    if (issue.type === "string") {
      return `${label}: at least ${issue.minimum} characters`;
    }
    if (issue.type === "array") {
      return `${label}: add at least ${issue.minimum}`;
    }
  }

  if (issue.code === "invalid_enum_value") {
    return `${label}: choose a valid option`;
  }

  if (issue.code === "invalid_string" && issue.validation === "url") {
    return `${label}: enter a valid URL`;
  }

  if (issue.message?.startsWith("Too small")) {
    if (issue.type === "string") {
      return `${label}: at least ${issue.minimum} characters`;
    }
    if (issue.type === "array") {
      return `${label}: add at least ${issue.minimum}`;
    }
  }

  return issue.message;
};

export const formatZodIssues = (issues) =>
  issues.map((issue) => formatIssue(issue)).join(" • ");
