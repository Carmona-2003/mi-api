const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const prisma = require("./prismaClient");

app.get("/roles", async (req, res) => {
  const roles = await prisma.rol.findMany(); // si tu modelo se llama Rol
  res.json(roles);
});

app.post("/roles", async (req, res) => {
  const { nombre, estado } = req.body; // estado: "ACTIVO" o "INACTIVO"
  const rol = await prisma.rol.create({
    data: { nombre, estado }
  });
  res.json(rol);
});


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Healthcheck
app.get("/health", (req, res) => res.json({ ok: true }));

// Demo: crear tabla


// CRUD simple
app.get("/users", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error listando users" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ ok: false, error: "name requerido" });

    const { rows } = await pool.query(
      "INSERT INTO users(name) VALUES($1) RETURNING *",
      [name]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error creando user" });
  }
});

// Render usa PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log("API running on", PORT));
