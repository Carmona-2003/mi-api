const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: "Token requerido" });

  const token = h.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, rolId }
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};
