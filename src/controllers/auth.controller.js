const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const transporter = require("../config/mailer");

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

exports.forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ error: "Correo requerido" });

    const usuario = await prisma.usuarios.findUnique({ where: { correo } });

    // Importante: no revelar si existe o no
    if (!usuario) return res.json({ message: "Si el correo existe, se enviará un código" });

    const codigo = generarCodigo();
    const expira = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await prisma.usuarios.update({
      where: { id_usuario: usuario.id_usuario },
      data: { reset_codigo: codigo, reset_expira: expira },
    });

    await transporter.sendMail({
      from: `"Soporte" <${process.env.MAIL_USER}>`,
      to: correo,
      subject: "Recuperación de contraseña",
      html: `<p>Tu código de recuperación es:</p><h2>${codigo}</h2><p>Vence en 15 minutos.</p>`,
    });

    return res.json({ message: "Código enviado" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { correo, codigo, nuevaContrasena } = req.body;
    if (!correo || !codigo || !nuevaContrasena) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const usuario = await prisma.usuarios.findFirst({
      where: {
        correo,
        reset_codigo: codigo,
        reset_expira: { gt: new Date() },
      },
    });

    if (!usuario) return res.status(400).json({ error: "Código inválido o expirado" });

    const hash = await bcrypt.hash(nuevaContrasena, 10);

    await prisma.usuarios.update({
      where: { id_usuario: usuario.id_usuario },
      data: {
        contrasena: hash,
        reset_codigo: null,
        reset_expira: null,
      },
    });

    return res.json({ message: "Contraseña actualizada" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
