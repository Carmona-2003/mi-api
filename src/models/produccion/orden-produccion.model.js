module.exports = {
  model: "ordenProduccion",
  id: "id_orden",

  include: {
    cliente: true,
    verDetalleOrdens: true,
    desempenos: true,
  },
};
