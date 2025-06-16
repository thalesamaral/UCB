// Importa o model de Usuário para interagir com o banco de dados
const { Usuario } = require("../models");

// Define um objeto que conterá todas as funções do controller
const usuarioController = {
    // Função para criar um novo usuário (assíncrona pois interage com o BD)
    async create(req, res) {
        try {
            // Pega os dados enviados no corpo da requisição (JSON)
            // O middleware express.json() no server.js permite isso
            const { nome, email, senha, perfil } = req.body;

            // Usa o model do Sequelize para criar um novo registro no banco
            const novoUsuario = await Usuario.create({
                nome,
                email,
                senha,
                perfil,
            });

            // Retorna uma resposta de sucesso (Status 201 - Created) com o usuário criado
            res.status(201).json(novoUsuario);
        } catch (error) {
            // Em caso de erro (ex: email já existe), retorna um erro
            // O ideal é tratar os tipos de erro, mas por enquanto uma resposta genérica serve
            console.error(error);
            res.status(400).json({
                error: "Erro ao criar usuário: " + error.message,
            });
        }
    },

    // ... futuramente, aqui entrarão outras funções (listar, atualizar, deletar)
};

// Exporta o controller para ser usado nas rotas
module.exports = usuarioController;
