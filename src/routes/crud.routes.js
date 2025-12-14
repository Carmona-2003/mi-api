const router = require("express").Router();
const crud = require("../controllers/crud.controller");

module.exports = (model, id) => {
  router.get("/", crud.list(model));
  router.get("/:id", crud.get(model, id));
  router.post("/", crud.create(model));
  router.put("/:id", crud.update(model, id));
  router.delete("/:id", crud.remove(model, id));

  return router;
};
