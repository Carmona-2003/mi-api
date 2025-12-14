const router = require("express").Router();
const crud = require("../controllers/crud.controller");

router.get("/", crud.list("desempeno"));
router.post("/", crud.create("desempeno"));

module.exports = router;
