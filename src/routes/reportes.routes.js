const router = require("express").Router();
const crud = require("../controllers/crud.controller");

router.get("/", crud.list("reportesDesempeno"));
router.post("/", crud.create("reportesDesempeno"));

module.exports = router;
