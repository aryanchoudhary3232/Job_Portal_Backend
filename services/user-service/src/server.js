import app from "./app.js";

const port = Number(process.env.USER_SERVICE_PORT || 4002);
app.listen(port, () => console.log(`user-service running on ${port}`));
