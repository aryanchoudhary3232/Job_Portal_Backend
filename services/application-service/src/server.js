import app from "./app.js";

const port = Number(process.env.APPLICATION_SERVICE_PORT || 4004);
app.listen(port, () => console.log(`application-service running on ${port}`));
