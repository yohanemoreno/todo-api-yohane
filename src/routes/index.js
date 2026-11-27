const express = require("express");
router.use("/categorias", categoriaRoutes);
const tarefaRoutes = require("./tarefaRoutes");

const router = express.Router();

router.use("/tarefas", tarefaRoutes);
// Sprint 2: a rota de /categorias entra aqui.

const categoriaRoutes = require("./categoriaRoutes");

module.exports = router;
