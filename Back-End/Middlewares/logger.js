const express = require("express");
const router = express.Router();

// regex pra identificar arquivos estáticos (css, js, imagens, fontes, etc)
const assetRegex = /\.(css|js|png|jpg|jpeg|svg|ico|map|woff2?|ttf)$/i;

// middleware pra registrar as requisições no console
const logger = (req, res, next) => {
  // pula o log se for arquivo estático
  if (assetRegex.test(req.path)) return next();

  const data = new Date();
  // mostra a data, método HTTP e URL da requisição
  console.log(`[${data.toISOString()}] ${req.method} ${req.url}`);
  next();
};

router.use(logger);

module.exports = router;
