const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const emprestimoController = require("../controllers/emprestimoController"); // <<< CONTROLLER DE EMPRÉSTIMO

// Define as rotas e associa às funções do controller
router.post("/login", usuarioController.login);
router.post("/", usuarioController.create);
router.get("/", usuarioController.getAll);
router.get("/:id", usuarioController.getById);
router.put("/:id", usuarioController.update);
router.delete("/:id", usuarioController.delete);

// --- NOVA ROTA PARA BUSCAR EMPRÉSTIMOS DE UM USUÁRIO ---
router.get("/:leitor_id/emprestimos", emprestimoController.getByUsuario);

module.exports = router;
