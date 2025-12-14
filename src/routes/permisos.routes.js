const router = require("express").Router();
const crud = require("../controllers/crud.controller");

router.get("/", crud.list("permisos"));
router.post("/", crud.create("permisos"));

module.exports = router;
