const express = require("express");
const fs = require("fs");
const path = require("path");
const autenticador = require("../middlewares/autenticacao");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../index.html"));
});

module.exports = router;