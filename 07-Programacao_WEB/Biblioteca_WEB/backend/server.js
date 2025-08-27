const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { syncDatabase } = require("./src/models");

const app = express();
const port = 3000;

const usuariosRouter = require("./src/routes/usuarios");
const livrosRouter = require("./src/routes/livrosRoutes");
const emprestimosRouter = require("./src/routes/emprestimosRoutes");

app.use(cors());
app.use(express.json());

// Registra as rotas
app.use("/usuarios", usuariosRouter);
app.use("/livros", livrosRouter);
app.use("/emprestimos", emprestimosRouter);

// Sincroniza o banco de dados ao iniciar o servidor
syncDatabase();

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
