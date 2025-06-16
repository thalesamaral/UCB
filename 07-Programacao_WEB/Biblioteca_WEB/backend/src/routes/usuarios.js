const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// Rota POST /usuarios -> Chama a função create do controller
router.post("/", usuarioController.create);

// Rota GET /usuarios -> Chama a função getAll do controller
router.get("/", usuarioController.getAll);

// Rota GET /usuarios/:id -> Chama a função getById do controller
// O ':id' indica que é um parâmetro que será recebido na URL
router.get("/:id", usuarioController.getById);

// --- NOVA ROTA ---
// Rota PUT /usuarios/:id -> Chama a função update
router.put('/:id', usuarioController.update);

// --- NOVA ROTA ---
// Rota DELETE /usuarios/:id -> Chama a função delete
router.delete('/:id', usuarioController.delete);

// --- NOVA ROTA DE LOGIN ---
router.post('/login', usuarioController.login);

module.exports = router;
