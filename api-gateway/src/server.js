import app from "./app.js";

const port = Number(process.env.GATEWAY_PORT || 4000);
app.listen(port, () => console.log(`api-gateway running on ${port}`));
