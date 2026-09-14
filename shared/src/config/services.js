export const ports = {
  gateway: Number(process.env.GATEWAY_PORT || 4000),
  auth: Number(process.env.AUTH_SERVICE_PORT || 4001),
  users: Number(process.env.USER_SERVICE_PORT || 4002),
  jobs: Number(process.env.JOB_SERVICE_PORT || 4003),
  applications: Number(process.env.APPLICATION_SERVICE_PORT || 4004),
  admin: Number(process.env.ADMIN_SERVICE_PORT || 4005),
};

const resolveTarget = (envUrl, envHost, defaultPort) => {
  if (envUrl) return envUrl.replace(/\/$/, "");
  const host = envHost || "localhost";
  return `http://${host}:${defaultPort}`;
};

export const serviceTargets = {
  auth: resolveTarget(process.env.AUTH_SERVICE_URL, process.env.AUTH_SERVICE_HOST, ports.auth),
  users: resolveTarget(process.env.USER_SERVICE_URL, process.env.USER_SERVICE_HOST, ports.users),
  jobs: resolveTarget(process.env.JOB_SERVICE_URL, process.env.JOB_SERVICE_HOST, ports.jobs),
  applications: resolveTarget(process.env.APPLICATION_SERVICE_URL, process.env.APPLICATION_SERVICE_HOST, ports.applications),
  admin: resolveTarget(process.env.ADMIN_SERVICE_URL, process.env.ADMIN_SERVICE_HOST, ports.admin),
};
