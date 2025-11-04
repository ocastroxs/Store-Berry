const express = require("express");
const fs = require("fs");
const path = require("path");
const autenticador = require("../middlewares/autenticacao");
const router = express.Router();

// rota principal do cardápio
router.get("/", (req, res) => {
  // manda o arquivo HTML do cardápio
  res.sendFile(path.join(__dirname, "../../index.html"));
});

module.exports = router;