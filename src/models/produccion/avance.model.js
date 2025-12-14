module.exports = {
  // Nombre exacto del modelo en Prisma Client
  model: "avances",
  // PK exacta en tu tabla
  id: "id_avance",

  include: {
    detalle: true,
    operacion: true,
  },
};
