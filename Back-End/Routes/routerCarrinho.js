const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Caminho do JSON que vai guardar os itens do carrinho
const CARRINHO_PATH = path.join(__dirname, "../data/carrinho.json");

// Funções utilitárias
function lerCarrinho() {
    if (!fs.existsSync(CARRINHO_PATH)) {
        fs.writeFileSync(CARRINHO_PATH, JSON.stringify({ itens: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(CARRINHO_PATH));
}

function salvarCarrinho(data) {
    fs.writeFileSync(CARRINHO_PATH, JSON.stringify(data, null, 2));
}

// ========== ROTA PRINCIPAL ==========
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front-End/HTML/carrinho.html'));
});

// ========== API: PEGAR ITENS ==========
router.get('/api', (req, res) => {
    const data = lerCarrinho();
    res.json(data);
});

// ========== API: ADICIONAR ITEM ==========
router.post('/api', (req, res) => {
    const data = lerCarrinho();
    const novoItem = req.body;

    const existente = data.itens.find(i => i.nome === novoItem.nome);
    if (existente) {
        existente.quantidade += novoItem.quantidade;
    } else {
        data.itens.push(novoItem);
    }

    salvarCarrinho(data);
    res.json(data);
});

// ========== API: REMOVER ITEM ==========
router.delete('/api/:nome', (req, res) => {
    const { nome } = req.params;
    const data = lerCarrinho();

    data.itens = data.itens.filter(i => i.nome !== nome);
    salvarCarrinho(data);
    res.json(data);
});

module.exports = router;
