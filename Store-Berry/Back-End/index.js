const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const routerHome = require("./Routes/routerHome");
const routerCardapio = require("./Routes/routerCardapio");
const routerCarrinho = require("./Routes/routerCarrinho");
const routerConta = require("./Routes/routerConta");
const routerSobre = require("./Routes/routerSobre");

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));
app.use("/", routerHome);
app.use("/cardapio", routerCardapio);
app.use("/carrinho", routerCarrinho);
app.use("/conta", routerConta);
app.use("/sobre", routerSobre);

app.listen(port, () => {
  console.log(`🍓 Store Berry rodando em: http://localhost:${port}`);
});