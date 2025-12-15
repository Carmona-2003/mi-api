const router = require("express").Router();
const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ✅ Brevo API (NO SMTP)
const { sendEmail } = require("../utils/brevo");

// ✅ asegúrate que existe: src/middlewares/auth.middleware.js
const auth = require("../middlewares/auth.middleware");

// ==========================
// GET /api/auth/test-email
// Prueba envío real con Brevo
// ==========================
router.get("/test-email", async (req, res) => {
  try {
    const to = String(req.query.to || "alejo.jj05@gmail.com").trim();

    await sendEmail({
      to,
      subject: "Prueba Brevo ✅",
      html: "<p>Si ves este correo, Brevo API funciona ✅</p>",
      text: "Si ves este correo, Brevo API funciona ✅",
    });

    return res.json({
      ok: true,
      message: `Correo enviado a ${to} (Brevo API)`,
    });
  } catch (error) {
    console.error("TEST EMAIL ERROR:", error.response?.data || error.message);
    return res.status(500).json({
      ok: false,
      error: "No se pudo enviar el correo",
    });
  }
});

// =====================
// POST /api/auth/login
// =====================
router.post("/login", async (req, res) => {
  try {
    let { correo, contrasena } = req.body;

    correo = String(correo || "").trim().toLowerCase();
    contrasena = String(contrasena || "");

    if (!correo || !contrasena) {
      return res.status(400).json({ error: "correo y contrasena son requeridos" });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { correo },
      include: { rol: true },
    });

    if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: usuario.id_usuario, rolId: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rolId: usuario.id_rol,
      },
    });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return res.status(500).json({ error: "Error interno" });
  }
});

// ==================================
// POST /api/auth/forgot-password
// body: { correo } o { email }
// ==================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { correo, email } = req.body;
    const to = String(correo || email || "").trim().toLowerCase();

    if (!to) {
      return res.status(400).json({ ok: false, message: "Falta el correo" });
    }

    // ✅ Seguridad: si no existe, respondemos igual
    const usuario = await prisma.usuarios.findUnique({ where: { correo: to } });
    if (!usuario) {
      return res.json({ ok: true, message: "Si el correo existe, se enviará un enlace" });
    }

    // ✅ Token y expiración (15 min)
    const token = crypto.randomBytes(32).toString("hex");
    const expira = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.usuarios.update({
      where: { correo: to },
      data: {
        reset_codigo: token,
        reset_expira: expira,
      },
    });

    // ✅ URL del frontend (pon tu dominio real)
    const resetUrl = `https://TU-FRONTEND.com/reset-password?token=${token}`;

    // ✅ Enviar por Brevo API
    await sendEmail({
      to,
      subject: "Restablecer contraseña",
      html: `
        <p>Haz clic para restablecer tu contraseña:</p>
        <a href="${resetUrl}">Restablecer contraseña</a>
        <p>Este enlace expira en 15 minutos.</p>
      `,
      text: `Restablece tu contraseña: ${resetUrl}`,
    });

    return res.json({
      ok: true,
      message: "Si el correo existe, se enviará un enlace",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error.response?.data || error.message);

    // ✅ No revelamos detalles
    return res.status(200).json({
      ok: true,
      message: "Si el correo existe, se enviará un enlace",
    });
  }
});

// ==================================
// POST /api/auth/reset-password
// body: { correo, codigo, nuevaContrasena }
// ==================================
router.post("/reset-password", async (req, res) => {
  try {
    let { correo, codigo, nuevaContrasena } = req.body;

    correo = String(correo || "").trim().toLowerCase();
    codigo = String(codigo || "").trim();
    nuevaContrasena = String(nuevaContrasena || "");

    if (!correo || !codigo || !nuevaContrasena) {
      return res.status(400).json({
        error: "correo, codigo y nuevaContrasena son requeridos",
      });
    }

    if (nuevaContrasena.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener mínimo 6 caracteres" });
    }

    const usuario = await prisma.usuarios.findUnique({ where: { correo } });

    if (
      !usuario ||
      usuario.reset_codigo !== codigo ||
      !usuario.reset_expira ||
      new Date(usuario.reset_expira) < new Date()
    ) {
      return res.status(400).json({ error: "Código inválido o expirado" });
    }

    const hash = await bcrypt.hash(nuevaContrasena, 10);

    await prisma.usuarios.update({
      where: { id_usuario: usuario.id_usuario },
      data: {
        contrasena: hash,
        reset_codigo: null,
        reset_expira: null,
      },
    });

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (e) {
    console.error("RESET ERROR:", e);
    return res.status(500).json({ error: "Error interno" });
  }
});

// =====================
// GET /api/auth/me (opcional)
// =====================
router.get("/me", auth, async (req, res) => {
  try {
    const userId = Number(req.user?.id);

    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: userId },
      select: { id_usuario: true, nombre: true, correo: true, id_rol: true, estado: true },
    });

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    return res.json(usuario);
  } catch (e) {
    console.error("ME ERROR:", e);
    return res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
