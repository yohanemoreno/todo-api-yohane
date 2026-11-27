-- Script do banco da API de Tarefas
-- Rode este arquivo inteiro no MySQL Workbench (raio ⚡).
-- Ele apaga e recria tudo: pode rodar de novo sempre que quiser começar do zero.

DROP DATABASE IF EXISTS todo;
CREATE DATABASE todo;
USE todo;

-- O CREATE TABLE da tabela tarefas entra aqui.

-- Depois dele, o INSERT com a carga inicial (pelo menos 3 tarefas).

SELECT * FROM tarefas;
