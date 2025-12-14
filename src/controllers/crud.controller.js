const prisma = require("../prisma");
const getModel = require("../utils/model");

exports.list = (modelName) => async (req, res) => {
  const { model, include } = getModel(modelName);

  const data = await prisma[model].findMany({ include });
  res.json(data);
};

exports.get = (modelName, idField) => async (req, res) => {
  const { model, include } = getModel(modelName);

  const data = await prisma[model].findUnique({
    where: { [idField]: Number(req.params.id) },
    include,
  });

  res.json(data);
};

exports.create = (modelName) => async (req, res) => {
  const { model } = getModel(modelName);

  const data = await prisma[model].create({
    data: req.body,
  });

  res.status(201).json(data);
};

exports.update = (modelName, idField) => async (req, res) => {
  const { model } = getModel(modelName);

  const data = await prisma[model].update({
    where: { [idField]: Number(req.params.id) },
    data: req.body,
  });

  res.json(data);
};

exports.remove = (modelName, idField) => async (req, res) => {
  const { model } = getModel(modelName);

  await prisma[model].delete({
    where: { [idField]: Number(req.params.id) },
  });

  res.status(204).send();
};
