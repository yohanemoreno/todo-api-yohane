// ROTA: recebe a requisicao HTTP e chama o controller.

const express = require("express");
const tarefaController = require("../controllers/tarefaController");
const validarId = require("../middlewares/validarId");

const router = express.Router();

// As rotas de /tarefas entram aqui. Exemplo:
router.get("/", tarefaController.listar);

module.exports = router;
