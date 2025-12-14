module.exports = (cliente) => ({
  id: cliente.id_cliente,
  nombre: cliente.nombre,
  telefono: cliente.telefono,
  correo: cliente.correo,
  pagina: cliente.pagina,
});
