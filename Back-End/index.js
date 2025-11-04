// Importações principais
const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
const path = require("path");

// Importa os roteadores
const routerHome = require("./Routes/routerHome");
const routerCardapio = require("./Routes/routerCardapio");
const routerCarrinho = require("./Routes/routerCarrinho");
const routerConta = require("./Routes/routerConta");
const routerSobre = require("./Routes/routerSobre");
const logger = require("./Middlewares/logger");

app.use(logger);

// Configuração de sessão
app.use(
  session({
    secret: "store-berry-secret-2025",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// Middlewares para parsing de dados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "..")));
app.use(express.static(path.join(__dirname, "../Front-End")));

// Registra as rotas
app.use("/", routerHome);
app.use("/cardapio", routerCardapio);
app.use("/carrinho", routerCarrinho);
app.use("/conta", routerConta);
app.use("/sobre", routerSobre);

// Inicia o servidor
app.listen(port, () => {
  console.log(`🍓 Store Berry rodando em: http://localhost:${port}`);
});
