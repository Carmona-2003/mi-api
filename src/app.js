require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const apiRoutes = require("./utils/apiRoutes");

console.log("MAIL_HOST:", process.env.MAIL_HOST); // 👈 SOLO PARA PROBAR


const app = express();

// Middlewares primero
app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "API JIRESOFT",
    version: "1.0.0",
    status: "Corriendo 🚀",
    endpoints: apiRoutes,
  });
});

// Health
app.get("/health", (_, res) => res.json({ ok: true }));

// API (incluye /auth y tus CRUD)
app.use("/api", routes);

module.exports = app;
