const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { syncDatabase } = require('./src/models');

const app = express();
const port = 3000;

// Importa o roteador de usuários
const usuariosRouter = require("./src/routes/usuarios");

// Middleware para interpretar JSON
app.use(express.json());

// Registra as rotas de usuários no caminho /usuarios
app.use("/usuarios", usuariosRouter);
// app.use('/livros', livrosRouter); // Fará o mesmo para livros
// app.use('/emprestimos', emprestimosRouter); // E para empréstimos

// Sincroniza o banco de dados ao iniciar o servidor
syncDatabase();

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
