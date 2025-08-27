const express = require("express");
const router = express.Router();
const livroController = require("../controllers/livroController");

// Define as rotas e associa às funções do controller
router.post("/", livroController.create);
router.get("/", livroController.getAll);
router.get("/:id", livroController.getById);
router.put("/:id", livroController.update);
router.delete("/:id", livroController.delete);

module.exports = router;
