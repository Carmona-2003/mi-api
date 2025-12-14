const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const apiRoutes = require("./utils/apiRoutes");

app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "API JIRESOFT",
    version: "1.0.0",
    status: "Corriendo 🚀",
    endpoints: apiRoutes,
  });
});


app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api", routes);

module.exports = app;
