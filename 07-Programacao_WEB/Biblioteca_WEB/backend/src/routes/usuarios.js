const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const emprestimoController = require("../controllers/emprestimoController"); // <<< IMPORTE O CONTROLLER DE EMPRÉSTIMO

// ... rotas existentes de login, create, getAll, etc. ...
router.post("/login", usuarioController.login);
router.post("/", usuarioController.create);
router.get("/", usuarioController.getAll);
router.get("/:id", usuarioController.getById);
router.put("/:id", usuarioController.update);
router.delete("/:id", usuarioController.delete);

// --- NOVA ROTA PARA BUSCAR EMPRÉSTIMOS DE UM USUÁRIO ---
router.get("/:leitor_id/emprestimos", emprestimoController.getByUsuario);

module.exports = router;
