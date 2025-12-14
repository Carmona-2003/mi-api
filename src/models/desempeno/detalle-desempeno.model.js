module.exports = {
  model: "verDetalleDesempeno",
  id: "id_detalle",

  include: {
    desempeno: true,
    operaria: true,
    operacion: true,
    detalle: true,
    reportesDesempenos: true,
  },
};
