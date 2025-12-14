module.exports = (usuario) => ({
  id: usuario.id_usuario,
  nombre: usuario.nombre,
  correo: usuario.correo,
  estado: usuario.estado,
  rolId: usuario.id_rol,
});
