// SERVICE: a logica de Tarefa e o SQL que vai para o banco.

const { db } = require("../config/db");

// Os unicos valores aceitos (use na validacao):
const PRIORIDADES = ["baixa", "media", "alta"];
const STATUS = ["a_fazer", "fazendo", "feita"];

// As funcoes do service entram aqui.

async function listarTarefas(filtros) {
  const [linhas] = await db.query("SELECT * FROM tarefas");
  let resultado = linhas;
  return resultado;
}

async function buscarTarefaPorId(id) {
  const [linhas] = await db.query("SELECT * FROM tarefas WHERE id = ?", [id]);
  return linhas[0];
}

async function criarTarefa(dados) {
const [resultado] = await db.query(
"INSERT INTO tarefas (titulo, prioridade, status) VALUES (?, ?, ?)",
[dados.titulo, dados.prioridade, dados.status],
);
return await buscarTarefaPorId(resultado.insertId);
}

async function atualizarTarefa(id, dados) {
const [resultado] = await db.query(
"UPDATE tarefas SET titulo = ?, prioridade = ?, status = ? WHERE id = ?",
[dados.titulo, dados.prioridade, dados.status, id],
);
if (resultado.affectedRows === 0) return null;
return await buscarTarefaPorId(id);
}

async function atualizarParcialTarefa(id, dados) {
const tarefa = await buscarTarefaPorId(id);
if (!tarefa) return null;
if (dados.titulo !== undefined) tarefa.titulo = dados.titulo;
if (dados.prioridade !== undefined) tarefa.prioridade = dados.prioridade;
if (dados.status !== undefined) tarefa.status = dados.status;
return await atualizarTarefa(id, tarefa);
}

async function deletarTarefa(id) {
const [resultado] = await db.query("DELETE FROM tarefas WHERE id = ?", [id]);
return resultado.affectedRows > 0;
}

function validarTarefa(dados, completo) {
if (!dados) return "Envie os dados da tarefa em JSON";
if (completo && !dados.titulo) return "O titulo e obrigatorio";
if (completo && !dados.prioridade) return "A prioridade e obrigatoria";
if (completo && !dados.status) return "O status e obrigatorio";
if (
dados.prioridade !== undefined &&
!PRIORIDADES.includes(dados.prioridade)
) {
return "A prioridade deve ser baixa, media ou alta";
}
if (dados.status !== undefined && !STATUS.includes(dados.status)) {
return "O status deve ser a_fazer, fazendo ou feita";
}
return null;
}

module.exports = { listarTarefas, buscarTarefaPorId, criarTarefa, atualizarTarefa, atualizarParcialTarefa, deletarTarefa, validarTarefa };

