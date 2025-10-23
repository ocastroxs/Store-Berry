const express = require("express");
const fs = require("fs");
const autenticador = require("../middlewares/autenticacao");
const router = express.Router();

router.get('/criar', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front-End/HTML/cardapio.html'));
});

module.exports = router;