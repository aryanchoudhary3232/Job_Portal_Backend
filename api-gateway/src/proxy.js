import { serviceTargets } from "../../shared/src/config/services.js";

const targetMap = {
  auth: serviceTargets.auth,
  users: serviceTargets.users,
  jobs: serviceTargets.jobs,
  applications: serviceTargets.applications,
  admin: serviceTargets.admin,
};

export const proxyRequest = async (req, res, headers) => {
  const targetKey = req.params.service;
  const baseUrl = targetMap[targetKey];
  const path = req.originalUrl.replace(/^\/api/, "");
  const response = await fetch(`${baseUrl}${path}`, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
  });
  const payload = await response.text();
  const contentType = response.headers.get("content-type") || "application/json";
  res.status(response.status);
  res.setHeader("content-type", contentType);
  res.send(payload);
};
