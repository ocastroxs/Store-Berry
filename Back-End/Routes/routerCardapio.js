const express = require("express");
const fs = require("fs");
const autenticador = require("../middlewares/autenticacao");
const path = require("path");
const router = express.Router();

// rota principal do cardápio
router.get("/", (req, res) => {
  // manda o arquivo HTML do cardápio
  res.sendFile(path.join(__dirname, "../../Front-End/HTML/cardapio.html"));
});

module.exports = router;
