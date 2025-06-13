const express = require("express");
const router = express.Router();

// Futuramente, aqui virá o controller
// const usuarioController = require('../controllers/usuarioController');

// GET /usuarios - Listar todos os usuários
router.get("/", (req, res) => {
    res.send("Listando todos os usuários");
});

// POST /usuarios - Criar um novo usuário
router.post("/", (req, res) => {
    res.send("Criando um novo usuário");
});

// Exporta o router para ser usado no arquivo principal
module.exports = router;
