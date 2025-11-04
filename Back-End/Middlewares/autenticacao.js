// middleware de autenticação simples
const autenticador = (req, res, next) => {
  // pega o token do header da requisição
  const token = req.headers["authorization"];

  // verifica se o token tá correto
  if (token === "store-berry-token") {
    next(); // libera o acesso
  } else {
    res.status(401).send("Acesso negado!"); // bloqueia se o token tiver errado
  }
};

module.exports = autenticador;
