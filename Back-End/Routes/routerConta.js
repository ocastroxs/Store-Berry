const express = require("express");
const fs = require("fs");
const autenticador = require("../middlewares/autenticacao");
const path = require("path");
const bcrypt = require("bcrypt");
const router = express.Router();
const users = [];

router.get('/entrar', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front-End/HTML/entrar-conta.html'));
});

router.get('/criar', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front-End/HTML/criar-conta.html'));
});

router.post('/api/registrar', async (req, res) => {
    try {
        const { cpf, email, senha } = req.body;

        // Validações básicas
        if (!cpf || !email || !senha) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        // Verificar se usuário já existe
        const userExists = users.find(u => u.email === email || u.cpf === cpf);
        if (userExists) {
            return res.status(400).json({ error: "CPF ou Email já cadastrado" });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Extrair primeiro nome do email (antes do @)
        const primeiroNome = email.split('@')[0];

        // Salvar usuário
        const newUser = {
            id: users.length + 1,
            cpf: cpf.replace(/\D/g, ''), // Remove formatação
            email,
            senha: hashedPassword,
            nome: primeiroNome
        };
        users.push(newUser);

        res.json({ 
            success: true,
            message: "Conta criada com sucesso!" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar conta" });
    }
});

// API - Login
router.post('/api/login', async (req, res) => {
    try {
        const { cpf, email, senha } = req.body;

        // Validações básicas
        if ((!cpf && !email) || !senha) {
            return res.status(400).json({ error: "Preencha todos os campos" });
        }

        // Buscar usuário por CPF ou Email
        const user = users.find(u => 
            (cpf && u.cpf === cpf.replace(/\D/g, '')) || 
            (email && u.email === email)
        );

        if (!user) {
            return res.status(400).json({ error: "CPF/Email ou senha incorretos" });
        }

        // Verificar senha
        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) {
            return res.status(400).json({ error: "CPF/Email ou senha incorretos" });
        }

        // Criar sessão
        req.session.userId = user.id;
        req.session.userName = user.nome;

        res.json({ 
            success: true,
            message: "Login realizado com sucesso!",
            userName: user.nome
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao fazer login" });
    }
});

// API - Verificar se está logado
router.get('/api/verificar', (req, res) => {
    if (req.session.userId) {
        res.json({ 
            loggedIn: true, 
            userName: req.session.userName 
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// API - Logout
router.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao fazer logout" });
        }
        res.json({ success: true, message: "Logout realizado com sucesso!" });
    });
});

module.exports = router;