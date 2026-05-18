import app from "./app.js";

const port = Number(process.env.JOB_SERVICE_PORT || 4003);
app.listen(port, () => console.log(`job-service running on ${port}`));
