import app from "./app.js";

const port = Number(process.env.ADMIN_SERVICE_PORT || 4005);
app.listen(port, () => console.log(`admin-service running on ${port}`));
