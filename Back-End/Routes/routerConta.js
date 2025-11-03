const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const router = express.Router();

// Caminho do arquivo JSON
const USERS_FILE = path.join(__dirname, "../data/users.json");

// Função para ler usuários do arquivo
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna array vazio
    if (error.code === "ENOENT") {
      await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
      await fs.writeFile(USERS_FILE, "[]", "utf8");
      return [];
    }
    throw error;
  }
}

// Função para salvar usuários no arquivo
async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

// Middleware para verificar se NÃO está logado
function checkNotLoggedIn(req, res, next) {
  if (req.session.userId) {
    return res.redirect("/");
  }
  next();
}

router.get("/entrar", checkNotLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../../Front-End/HTML/entrar-conta.html"));
});

router.get("/criar", checkNotLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../../Front-End/HTML/criar-conta.html"));
});

// API - Criar conta
router.post("/api/registrar", async (req, res) => {
  try {
    const { cpf, email, senha } = req.body;

    if (!cpf || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    // Ler usuários existentes
    const users = await readUsers();

    // Verificar se usuário já existe
    const userExists = users.find((u) => u.email === email || u.cpf === cpf);
    if (userExists) {
      return res.status(400).json({ error: "CPF ou Email já cadastrado" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);
    const primeiroNome = email.split("@")[0];

    // Criar novo usuário
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      cpf: cpf.replace(/\D/g, ""),
      email,
      senha: hashedPassword,
      nome: primeiroNome,
      criadoEm: new Date().toISOString(),
    };

    // Adicionar e salvar
    users.push(newUser);
    await saveUsers(users);

    res.json({
      success: true,
      message: "Conta criada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
});

// API - Login
router.post("/api/login", async (req, res) => {
  try {
    const { cpf, email, senha } = req.body;

    if ((!cpf && !email) || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    // Ler usuários
    const users = await readUsers();

    // Buscar usuário por CPF ou Email
    const user = users.find(
      (u) =>
        (cpf && u.cpf === cpf.replace(/\D/g, "")) ||
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

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao salvar sessão" });
      }

      res.json({
        success: true,
        message: "Login realizado com sucesso!",
        userName: user.nome,
      });
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// API - Verificar se está logado
router.get("/api/verificar", (req, res) => {
  if (req.session.userId) {
    res.json({
      loggedIn: true,
      userName: req.session.userName,
    });
  } else {
    res.json({ loggedIn: false });
  }
});

// Função para limpar o carrinho do usuário no banco de dados
async function clearUserCart(userId) {
  try {
    const users = await readUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      // Se o usuário tiver um carrinho, limpa-o
      if (users[userIndex].cart) {
        users[userIndex].cart = [];
        await saveUsers(users);
      }
    }
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error);
    throw error;
  }
}

// API - Logout (MODIFICADA para limpar o carrinho)
router.post("/api/logout", (req, res) => {
  // Guarda o userId da sessão antes de destruí-la
  const userIdToLogout = req.session.userId;

  // Converte o callback para async para permitir operações de arquivo (limpar o carrinho)
  req.session.destroy(async (err) => {
    if (err) {
      // Falha ao destruir a sessão (erro grave)
      return res.status(500).json({ error: "Erro ao fazer logout" });
    }

    let clientCartClear = false;

    try {
      // Verifica se o usuário estava logado e limpa o carrinho no "banco de dados" (users.json)
      if (userIdToLogout) {
        await clearUserCart(userIdToLogout);
        clientCartClear = true; // Indica ao cliente que a limpeza no servidor foi feita
      }

      // Envia a resposta de sucesso
      res.json({
        success: true,
        message: "Logout realizado com sucesso!",
        // Esta flag informa ao Frontend para limpar o localStorage (próximo passo)
        clearClientCart: clientCartClear,
      });
    } catch (dataError) {
      console.error("Erro ao limpar o carrinho no logout:", dataError);
      // Mesmo que a limpeza do carrinho falhe, o logout (destruição da sessão) é considerado sucesso
      res.json({
        success: true,
        message:
          "Logout realizado com sucesso, mas o carrinho pode não ter sido apagado.",
      });
    }
  });
});

module.exports = router;
