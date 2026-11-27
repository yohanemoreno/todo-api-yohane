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

module.exports = { listarTarefas };
