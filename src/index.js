require("dotenv").config({ quiet: true });

const express = require("express");
const { testarConexao } = require("./config/db");
const routes = require("./routes");
const logger = require("./middlewares/logger");
const rotaNaoEncontrada = require("./middlewares/rotaNaoEncontrada");
const tratarErros = require("./middlewares/tratarErros");

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);
app.use(routes);

app.get("/", (req, res) => {
  res.send("API de Tarefas no ar!");
});

app.use(rotaNaoEncontrada);
app.use(tratarErros);

app.listen(PORTA, () => {
  console.log("Servidor rodando em http://localhost:" + PORTA);
  testarConexao();
});
