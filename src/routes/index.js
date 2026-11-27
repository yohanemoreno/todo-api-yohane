const express = require("express");
const tarefaRoutes = require("./tarefaRoutes");

const router = express.Router();

router.use("/tarefas", tarefaRoutes);
// Sprint 2: a rota de /categorias entra aqui.

module.exports = router;
