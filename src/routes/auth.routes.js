const router = require("express").Router();
const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");

// (Opcional) middleware para validar token si quieres /me
const auth = require("../middlewares/auth"); // si no lo tienes, borra /me y este require
const transporter = require("../config/mailer");


// =====================
// POST /api/auth/login
// =====================
router.post("/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

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

    res.json({
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
    res.status(500).json({ error: "Error interno" });
  }
});

// ==================================
// POST /api/auth/forgot-password
// body: { correo }
// ==================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ error: "correo es requerido" });
    }

    const usuario = await prisma.usuarios.findUnique({ where: { correo } });

    // No revelar si existe o no (seguridad)
    if (!usuario) {
      return res.json({ message: "Si el correo existe, se enviará un código" });
    }

    // Código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await prisma.usuarios.update({
      where: { id_usuario: usuario.id_usuario },
      data: { reset_codigo: codigo, reset_expira: expira },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER, // ✅ importante
      to: correo,
      subject: "Recuperación de contraseña",
      html: `
        <p>Tu código de recuperación es:</p>
        <h2 style="letter-spacing:2px">${codigo}</h2>
        <p>Válido por 15 minutos.</p>
      `,
    });

    return res.json({ message: "Si el correo existe, se enviará un código" });
  } catch (e) {
    console.error("FORGOT ERROR:", e);
    // igual no revelamos demasiado
    return res.json({ message: "Si el correo existe, se enviará un código" });
  }
});

// ==================================
// POST /api/auth/reset-password
// body: { correo, codigo, nuevaContrasena }
// ==================================
router.post("/reset-password", async (req, res) => {
  try {
    const { correo, codigo, nuevaContrasena } = req.body;

    if (!correo || !codigo || !nuevaContrasena) {
      return res.status(400).json({
        error: "correo, codigo y nuevaContrasena son requeridos",
      });
    }

    if (String(nuevaContrasena).length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener mínimo 6 caracteres" });
    }

    const usuario = await prisma.usuarios.findUnique({ where: { correo } });

    if (
      !usuario ||
      usuario.reset_codigo !== String(codigo) ||
      !usuario.reset_expira ||
      usuario.reset_expira < new Date()
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
    res.status(500).json({ error: "Error interno" });
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
    res.json(usuario);
  } catch (e) {
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
