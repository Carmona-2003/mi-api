const router = require("express").Router();
const crud = require("../controllers/crud.controller");

router.get("/", crud.list("usuarios"));
router.get("/:id", crud.getById("usuarios", "id_usuario"));
router.post("/", crud.create("usuarios"));
router.put("/:id", crud.update("usuarios", "id_usuario"));
router.delete("/:id", crud.remove("usuarios", "id_usuario"));

module.exports = router;
