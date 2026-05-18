import { createApp, attachErrorHandler } from "../../../shared/src/http/create-app.js";
import jobRoutes from "./routes/job.routes.js";

const app = createApp("job-service");

app.use("/jobs", jobRoutes);
attachErrorHandler(app);

export default app;
