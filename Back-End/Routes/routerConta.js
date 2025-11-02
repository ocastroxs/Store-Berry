const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const router = express.Router();
const users = [];

// Middleware para verificar se NÃO está logado
function checkNotLoggedIn(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/');
    }
    next();
}

router.get('/entrar', checkNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front-End/HTML/entrar-conta.html'));
});

router.get('/criar', checkNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front-End/HTML/criar-conta.html'));
});

// API - Criar conta
router.post('/api/registrar', async (req, res) => {
    try {
        const { cpf, email, senha } = req.body;

        if (!cpf || !email || !senha) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const userExists = users.find(u => u.email === email || u.cpf === cpf);
        if (userExists) {
            return res.status(400).json({ error: "CPF ou Email já cadastrado" });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);
        const primeiroNome = email.split('@')[0];

        const newUser = {
            id: users.length + 1,
            cpf: cpf.replace(/\D/g, ''),
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

// API - Login (CORRIGIDO)
router.post('/api/login', async (req, res) => {
    try {
        const { cpf, email, senha } = req.body;

        if ((!cpf && !email) || !senha) {
            return res.status(400).json({ error: "Preencha todos os campos" });
        }

        const user = users.find(u => 
            (cpf && u.cpf === cpf.replace(/\D/g, '')) || 
            (email && u.email === email)
        );

        if (!user) {
            return res.status(400).json({ error: "CPF/Email ou senha incorretos" });
        }

        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) {
            return res.status(400).json({ error: "CPF/Email ou senha incorretos" });
        }

        // Criar sessão e ESPERAR salvar
        req.session.userId = user.id;
        req.session.userName = user.nome;

        // IMPORTANTE: Garantir que a sessão foi salva antes de responder
        req.session.save((err) => {
            if (err) {
                console.error('Erro ao salvar sessão:', err);
                return res.status(500).json({ error: "Erro ao salvar sessão" });
            }
            
            res.json({ 
                success: true,
                message: "Login realizado com sucesso!",
                userName: user.nome
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao fazer login" });
    }
});

// API - Verificar se está logado
router.get('/api/verificar', (req, res) => {
    console.log('Verificando sessão:', req.session); // Debug
    
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