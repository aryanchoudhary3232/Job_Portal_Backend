import { createApp, attachErrorHandler } from "../../shared/src/http/create-app.js";
import gatewayRoutes from "./routes/gateway.routes.js";

const app = createApp("api-gateway");

app.use("/api", gatewayRoutes);
attachErrorHandler(app);

export default app;
