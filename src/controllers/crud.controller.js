const getModel = require("../utils/model");

exports.list = (modelName) => async (req, res) => {
  try {
    const { delegate, include } = getModel(modelName);
    const data = await delegate.findMany(include ? { include } : undefined);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.get = (modelName, idField) => async (req, res) => {
  try {
    const { delegate, include } = getModel(modelName);
    const id = Number(req.params.id);

    const data = await delegate.findUnique({
      where: { [idField]: id },
      ...(include ? { include } : {}),
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.create = (modelName) => async (req, res) => {
  try {
    const { delegate, include } = getModel(modelName);

    const data = await delegate.create({
      data: req.body,
      ...(include ? { include } : {}),
    });

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = (modelName, idField) => async (req, res) => {
  try {
    const { delegate, include } = getModel(modelName);
    const id = Number(req.params.id);

    const data = await delegate.update({
      where: { [idField]: id },
      data: req.body,
      ...(include ? { include } : {}),
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.remove = (modelName, idField) => async (req, res) => {
  try {
    const { delegate } = getModel(modelName);
    const id = Number(req.params.id);

    await delegate.delete({
      where: { [idField]: id },
    });

    res.json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
