import { createApp, attachErrorHandler } from "../../../shared/src/http/create-app.js";
import applicationRoutes from "./routes/application.routes.js";

const app = createApp("application-service");

app.use("/applications", applicationRoutes);
attachErrorHandler(app);

export default app;
