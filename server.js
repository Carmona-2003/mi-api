import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.js";



const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", usersRoutes);

app.get("/", (req, res) => res.json({ ok: true, msg: "API funcionando" }));
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log("Running on port", PORT));
