const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// Rota POST /usuarios -> Chama a função create do controller
router.post("/", usuarioController.create);

// --- NOVA ROTA ---
// Rota GET /usuarios -> Chama a função getAll do controller
router.get("/", usuarioController.getAll);

// --- NOVA ROTA ---
// Rota GET /usuarios/:id -> Chama a função getById do controller
// O ':id' indica que é um parâmetro que será recebido na URL
router.get("/:id", usuarioController.getById);

module.exports = router;
