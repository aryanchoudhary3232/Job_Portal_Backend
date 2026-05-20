import app from "./app.js";
import { seedDemoUsers } from "./bootstrap/seed-demo-users.js";

const port = Number(process.env.AUTH_SERVICE_PORT || 4001);

const start = async () => {
  try {
    await seedDemoUsers();
    console.log("Demo accounts ready (staff@demo.com, student@demo.com, recruiter@demo.com)");
  } catch (error) {
    console.error("Demo account seed skipped:", error.message);
  }

  app.listen(port, () => console.log(`auth-service running on ${port}`));
};

start();
