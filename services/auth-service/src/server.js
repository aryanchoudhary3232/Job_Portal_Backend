import app from "./app.js";

const port = Number(process.env.AUTH_SERVICE_PORT || 4001);
app.listen(port, () => console.log(`auth-service running on ${port}`));
