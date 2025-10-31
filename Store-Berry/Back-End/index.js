const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
const path = require("path");

const routerHome = require("./Routes/routerHome");
const routerCardapio = require("./Routes/routerCardapio");
const routerCarrinho = require("./Routes/routerCarrinho");
const routerConta = require("./Routes/routerConta");
const routerSobre = require("./Routes/routerSobre");
const logger = require("./Middlewares/logger");

app.use(logger);

app.use(session({
  secret: 'senha123',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));
app.use(express.static(path.join(__dirname, "../Front-End")));
app.use("/", routerHome);
app.use("/cardapio", routerCardapio);
app.use("/carrinho", routerCarrinho);
app.use("/conta", routerConta);
app.use("/sobre", routerSobre);

app.listen(port, () => {
  console.log(`🍓 Store Berry rodando em: http://localhost:${port}`);
});