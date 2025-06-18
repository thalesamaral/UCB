const express = require("express");
const router = express.Router();
const emprestimoController = require("../controllers/emprestimoController");

router.post("/", emprestimoController.create);
router.get("/", emprestimoController.getAll);
router.put("/:id/aprovar", emprestimoController.aprovar);
router.put("/:id/reprovar", emprestimoController.reprovar);
router.put("/:id/devolver", emprestimoController.devolver);
router.put("/:id/perda", emprestimoController.registrarPerda);

module.exports = router;
