// Recebe qualquer erro que aconteceu numa rota e escolhe o status certo.
// O codigo do erro aparece no terminal: e por ele que o "if" decide.

function tratarErros(err, req, res, next) {
  console.log("ERRO:", err.code, err.message);

  // Sprint 2: os "if" dos erros do banco entram aqui, ANTES do 500.

  res.status(500).json({ erro: "Erro interno no servidor" });
}

module.exports = tratarErros;
