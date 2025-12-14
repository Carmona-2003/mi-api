const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seguridad = {
  rol: require("../models/seguridad/rol.model"),
  permiso: require("../models/seguridad/permiso.model"),
  usuario: require("../models/seguridad/usuario.model"),
  detalleRol: require("../models/seguridad/detalle-rol.model"),
};

const produccion = {
  cliente: require("../models/produccion/cliente.model"),
  ordenProduccion: require("../models/produccion/orden-produccion.model"),
  referencia: require("../models/produccion/referencia.model"),
  detalleOrden: require("../models/produccion/detalle-orden.model"),
  maquina: require("../models/produccion/maquina.model"),
  operacion: require("../models/produccion/operacion.model"),
  avance: require("../models/produccion/avance.model"),
};

const desempeno = {
  desempeno: require("../models/desempeno/desempeno.model"),
  detalleDesempeno: require("../models/desempeno/detalle-desempeno.model"),
  reporteDesempeno: require("../models/desempeno/reporte-desempeno.model"),
  operaria: require("../models/desempeno/operaria.model"),
  
};

const MODELS = { ...seguridad, ...produccion, ...desempeno };

module.exports = (name) => {
  const cfg = MODELS[name];

  if (!cfg) {
    throw new Error(
      `Modelo no encontrado: ${name}. Disponibles: ${Object.keys(MODELS).join(", ")}`
    );
  }

  // cfg.model debe ser el delegate de Prisma, ejemplo: "roles", "usuarios", etc.
  const delegate = prisma[cfg.model];

  if (!delegate) {
    throw new Error(
      `Delegate Prisma no encontrado: prisma.${cfg.model}. Revisa el campo "model" en ${name}.model.js`
    );
  }

  return {
    delegate,
    id: cfg.id,
    include: cfg.include,
  };
};
