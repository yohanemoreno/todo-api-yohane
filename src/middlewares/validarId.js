// Barra o pedido se o :id da URL nao for um numero (ex.: /tarefas/abc).

function validarId(req, res, next) {
  if (isNaN(Number(req.params.id))) {
    res.status(400).json({ erro: "O id deve ser um numero" });
    return;
  }
  next();
}

module.exports = validarId;
