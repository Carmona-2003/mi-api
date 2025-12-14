module.exports = {
  model: "operaciones",
  id: "id_operacion",

  include: {
    referencia: true,
    maquina: true,
    avances: true,
    verDetalleDesempenos: true,
  },
};
