const router = require("express").Router();
const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../utils/mailer"); 

router.post("/login", async (req, res) => {
  const { correo, contrasena } = req.body;

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
});

router.post("/forgot-password", async (req, res) => {
  const { correo } = req.body;

  const usuario = await prisma.usuarios.findUnique({
    where: { correo },
  });

  // No revelar si existe o no (seguridad)
  if (!usuario) {
    return res.json({
      message: "Si el correo existe, se enviará un código",
    });
  }

  // Código de 6 dígitos
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  const expira = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await prisma.usuarios.update({
    where: { id_usuario: usuario.id_usuario },
    data: {
      reset_codigo: codigo,
      reset_expira: expira,
    },
  });

  await transporter.sendMail({
    to: correo,
    subject: "Recuperación de contraseña",
    html: `
      <p>Tu código de recuperación es:</p>
      <h2>${codigo}</h2>
      <p>Válido por 15 minutos.</p>
    `,
  });

  res.json({
    message: "Si el correo existe, se enviará un código",
  });
});

router.post("/reset-password", async (req, res) => {
  const { correo, codigo, nuevaContrasena } = req.body;

  const usuario = await prisma.usuarios.findUnique({
    where: { correo },
  });

  if (
    !usuario ||
    usuario.reset_codigo !== codigo ||
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

  res.json({ message: "Contraseña actualizada correctamente" });
});


module.exports = router;
