import { createApp, attachErrorHandler } from "../../../shared/src/http/create-app.js";
import adminRoutes from "./routes/admin.routes.js";

const app = createApp("admin-service");

app.use("/admin", adminRoutes);
attachErrorHandler(app);

export default app;
