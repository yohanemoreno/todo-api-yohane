// ROTA: recebe a requisicao HTTP e chama o controller.

const express = require("express");
const tarefaController = require("../controllers/tarefaController");
const validarId = require("../middlewares/validarId");

const router = express.Router();

// As rotas de /tarefas entram aqui. Exemplo:
router.get("/", tarefaController.listar);
router.get("/:id", validarId, tarefaController.buscarPorId);
router.post("/", tarefaController.criar);
router.put("/:id", validarId, tarefaController.atualizar);
router.patch("/:id", validarId, tarefaController.atualizarParcial);
router.delete("/:id", validarId, tarefaController.deletar);

module.exports = router;
