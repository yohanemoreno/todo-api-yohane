const { db } = require("../config/db");
async function listarCategorias() {
const [linhas] = await db.query("SELECT * FROM categorias");
return linhas;
}
async function buscarCategoriaPorId(id) {
const [linhas] = await db.query("SELECT * FROM categorias WHERE id = ?", [id]);
return linhas[0];
}
function validarCategoria(dados) {
if (!dados || !dados.nome) return "O nome e obrigatorio";
return null;
}
async function criarCategoria(dados) {
const [resultado] = await db.query("INSERT INTO categorias (nome) VALUES (?)", [
dados.nome,
]);
return await buscarCategoriaPorId(resultado.insertId);
}
async function deletarCategoria(id) {
const [resultado] = await db.query("DELETE FROM categorias WHERE id = ?", [id]);
return resultado.affectedRows > 0;
}
module.exports = {
validarCategoria,
listarCategorias,
buscarCategoriaPorId,
criarCategoria,
deletarCategoria,
};
