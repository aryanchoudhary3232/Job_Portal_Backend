export const ports = {
  gateway: Number(process.env.GATEWAY_PORT || 4000),
  auth: Number(process.env.AUTH_SERVICE_PORT || 4001),
  users: Number(process.env.USER_SERVICE_PORT || 4002),
  jobs: Number(process.env.JOB_SERVICE_PORT || 4003),
  applications: Number(process.env.APPLICATION_SERVICE_PORT || 4004),
  admin: Number(process.env.ADMIN_SERVICE_PORT || 4005),
};

export const serviceTargets = {
  auth: `http://localhost:${ports.auth}`,
  users: `http://localhost:${ports.users}`,
  jobs: `http://localhost:${ports.jobs}`,
  applications: `http://localhost:${ports.applications}`,
  admin: `http://localhost:${ports.admin}`,
};
