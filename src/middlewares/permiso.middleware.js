const prisma = require("../prisma");

module.exports = (permisoRequerido) => async (req, res, next) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) return res.status(401).json({ error: "Token inválido" });

    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: userId },
      include: {
        rol: { include: { permisos: true } },
      },
    });

    if (!usuario) return res.status(401).json({ error: "Usuario no válido" });

    const permisos = (usuario.rol?.permisos || []).map(p => p.descripcion);
    if (!permisos.includes(permisoRequerido)) {
      return res.status(403).json({ error: "No tienes permiso" });
    }

    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
