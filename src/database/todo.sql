-- Script do banco da API de Tarefas
-- Rode este arquivo inteiro no MySQL Workbench (raio ⚡).
-- Ele apaga e recria tudo: pode rodar de novo sempre que quiser começar do zero.

DROP DATABASE IF EXISTS todo;
CREATE DATABASE todo;
USE todo;

-- O CREATE TABLE da tabela tarefas entra aqui.

CREATE TABLE tarefas (
id INT AUTO_INCREMENT PRIMARY KEY,
titulo VARCHAR(100) NOT NULL,
prioridade VARCHAR(10) NOT NULL,
status VARCHAR(10) NOT NULL
);
INSERT INTO tarefas (titulo, prioridade, status) VALUES
('Estudar para a prova de PBE', 'alta', 'fazendo'),
('Lavar a louça', 'media', 'feita'),
('Arrumar o quarto', 'alta', 'fazendo');

-- Depois dele, o INSERT com a carga inicial (pelo menos 3 tarefas).

SELECT * FROM tarefas;
