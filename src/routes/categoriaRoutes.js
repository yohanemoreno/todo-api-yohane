// ROTA: recebe a requisicao HTTP e chama o controller.

const express = require("express");
const categoriaController = require("../controllers/categoriaController");
const validarId = require("../middlewares/validarId");

const router = express.Router();

router.get("/", categoriaController.listar);
router.get("/:id", validarId, categoriaController.buscarPorId);
router.post("/", categoriaController.criar);
router.delete("/:id", validarId, categoriaController.deletar);

module.exports = router;