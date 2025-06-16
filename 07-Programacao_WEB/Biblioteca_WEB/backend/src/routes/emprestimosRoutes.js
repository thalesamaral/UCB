const express = require("express");
const router = express.Router();
const emprestimoController = require("../controllers/emprestimoController");

// Rota para criar um novo empréstimo
router.post("/", emprestimoController.create);

// Rota para listar todos os empréstimos
router.get("/", emprestimoController.getAll);

// Rota para um bibliotecário registrar a devolução de um livro
// Usamos PUT pois estamos atualizando o status do empréstimo
router.put("/:id/devolver", emprestimoController.devolver);

module.exports = router;
