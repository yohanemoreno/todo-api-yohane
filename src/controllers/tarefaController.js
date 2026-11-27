// CONTROLLER: recebe da rota, chama o service e devolve a resposta.

const tarefaService = require("../services/tarefaService");

// As funcoes do controller entram aqui.

async function listar(req, res) {
const tarefas = await tarefaService.listarTarefas(req.query);
res.status(200).json(tarefas);
}

async function buscarPorId(req, res) {
const tarefa = await tarefaService.buscarTarefaPorId(req.params.id);
if (!tarefa) {
res.status(404).json({ erro: "Tarefa nao encontrada" });
return;
}
res.status(200).json(tarefa);
}

module.exports = {
  listar,
  buscarPorId, 
};
