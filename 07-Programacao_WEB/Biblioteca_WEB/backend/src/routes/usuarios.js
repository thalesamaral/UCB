const express = require("express");
const router = express.Router();

// Futuramente, aqui virá o controller
const usuarioController = require("../controllers/usuarioController");

// Rota POST /usuarios
// Quando uma requisição POST chegar para '/usuarios', ela vai acionar a função 'create' do nosso controller.
router.post("/", usuarioController.create);

// Rota GET /usuarios - Deixamos como exemplo por enquanto
router.get("/", (req, res) => {
    res.send("Futuramente, aqui serão listados todos os usuários");
});

// Exporta o router com a nova configuração
module.exports = router;
