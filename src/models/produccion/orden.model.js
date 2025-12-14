module.exports = (orden) => ({
  id: orden.id_orden,
  fechaCreacion: orden.fecha_creacion,
  estado: orden.estado,
  clienteId: orden.id_cliente,
});
