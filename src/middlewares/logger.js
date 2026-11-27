// Mostra no terminal cada requisicao que chega, com o tempo de resposta.

function logger(req, res, next) {
  const inicio = Date.now();
  res.on("finish", () => {
    const duracao = Date.now() - inicio;
    console.log(
      `${req.method} ${req.originalUrl} -> ${res.statusCode} (${duracao}ms)`,
    );
  });
  next();
}

module.exports = logger;
