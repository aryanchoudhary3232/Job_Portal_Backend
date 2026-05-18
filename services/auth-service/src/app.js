import { createApp, attachErrorHandler } from "../../../shared/src/http/create-app.js";
import authRoutes from "./routes/auth.routes.js";

const app = createApp("auth-service");

app.use("/auth", authRoutes);
attachErrorHandler(app);

export default app;
