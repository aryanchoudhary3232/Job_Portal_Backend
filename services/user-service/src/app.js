import { createApp, attachErrorHandler } from "../../../shared/src/http/create-app.js";
import userRoutes from "./routes/user.routes.js";

const app = createApp("user-service");

app.use("/users", userRoutes);
attachErrorHandler(app);

export default app;
