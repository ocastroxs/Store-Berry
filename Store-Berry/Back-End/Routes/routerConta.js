const express = require("express");
const fs = require("fs");
const autenticador = require("../middlewares/autenticacao");
const router = express.Router();

router.get('/entrar', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front-End/HTML/entrar-conta.html'));
});

router.get('/criar', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front-End/HTML/criar-conta.html'));
});

module.exports = router;