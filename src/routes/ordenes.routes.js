const router = require("express").Router();
const crud = require("../controllers/crud.controller");

router.get("/", crud.list("ordenProduccion"));
router.get("/:id", crud.getById("ordenProduccion", "id_orden"));
router.post("/", crud.create("ordenProduccion"));

module.exports = router;
