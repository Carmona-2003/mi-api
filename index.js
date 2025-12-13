const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

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
app.get("/init", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    res.json({ ok: true, msg: "Tabla users lista" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error creando tabla" });
  }
});

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
