// CONTROLLER: recebe da rota, chama o service e devolve a resposta.

const tarefaService = require("../services/tarefaService");

// As funcoes do controller entram aqui.

async function listar(req, res) {
const tarefas = await tarefaService.listarTarefas(req.query);
res.status(200).json(tarefas);
}

module.exports = { listar };
