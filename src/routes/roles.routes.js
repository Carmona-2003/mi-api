const router = require("express").Router();
const crud = require("../controllers/crud.controller");

router.get("/", crud.list("roles"));
router.get("/:id", crud.getById("roles", "id_rol"));
router.post("/", crud.create("roles"));
router.put("/:id", crud.update("roles", "id_rol"));
router.delete("/:id", crud.remove("roles", "id_rol"));

module.exports = router;
