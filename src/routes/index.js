const { Router } = require("express");
const crudRouter = require("./crud.routes");

const router = Router();

router.use("/auth", require("./auth.routes"));

// Seguridad
router.use("/roles", crudRouter("rol", "id_rol"));
router.use("/permisos", crudRouter("permiso", "id_permiso"));
router.use("/usuarios", crudRouter("usuario", "id_usuario"));
router.use("/detalle-rol", crudRouter("detalleRol", "id_detalle"));

// Producción
router.use("/clientes", crudRouter("cliente", "id_cliente"));
router.use("/ordenes", crudRouter("ordenProduccion", "id_orden"));
router.use("/referencias", crudRouter("referencia", "id_referencia"));
router.use("/detalle-orden", crudRouter("detalleOrden", "id_detalle"));
router.use("/maquinas", crudRouter("maquina", "id_maquina"));
router.use("/operaciones", crudRouter("operacion", "id_operacion"));
router.use("/avances", crudRouter("avance", "id_avance"));

// Desempeño (faltaban)
router.use("/desempenos", crudRouter("desempeno", "id_desempeno"));
router.use("/operarias", crudRouter("operaria", "id_operaria"));
router.use("/detalle-desempeno", crudRouter("detalleDesempeno", "id_detalle"));
router.use("/reportes-desempeno", crudRouter("reporteDesempeno", "id_reporte"));

module.exports = router;
