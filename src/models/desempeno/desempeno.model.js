module.exports = {
  model: "desempeno",
  id: "id_desempeno",

  include: {
    orden: true,
    verDetalleDesempenos: true,
    reportesDesempenos: true,
  },
};
