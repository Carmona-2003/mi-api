const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // 1) Rol ADMIN
  const adminRol = await prisma.roles.upsert({
    where: { id_rol: 1 },
    update: {},
    create: { nombre: "ADMIN", estado: "ACTIVO" },
  });

  // 2) Permisos base (ajusta descripciones a tu gusto)
  const permisosBase = [
    "VER_ORDEN",
    "CREAR_ORDEN",
    "CREAR_USUARIO",
    "ELIMINAR_USUARIO",
  ];

  const permisos = [];
  for (const desc of permisosBase) {
    const p = await prisma.permisos.create({
      data: { descripcion: desc, id_rol: adminRol.id_rol },
    });
    permisos.push(p);
  }

  // 3) Vincular permisos a detalle_rol (si tu lógica usa esta tabla)
  for (const p of permisos) {
    await prisma.verDetalleRol.create({
      data: { id_rol: adminRol.id_rol, id_permiso: p.id_permiso },
    });
  }

  // 4) Usuario admin
  const pass = await bcrypt.hash("Admin123*", 10);

  await prisma.usuarios.upsert({
    where: { correo: "admin@local.com" },
    update: {},
    create: {
      nombre: "Admin",
      correo: "admin@local.com",
      contrasena: pass,
      estado: "ACTIVO",
      id_rol: adminRol.id_rol,
    },
  });

  console.log("✅ Seed OK: ADMIN + permisos + usuario admin@local.com / Admin123*");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
