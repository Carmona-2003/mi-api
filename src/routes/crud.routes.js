const express = require("express");
const crud = require("../controllers/crud.controller");

module.exports = function crudRouter(model, id) {
  const router = express.Router();

  router.get("/", crud.list(model));
  router.get("/:id", crud.get(model, id));
  router.post("/", crud.create(model));
  router.put("/:id", crud.update(model, id));
  router.delete("/:id", crud.remove(model, id));

  return router;
};
