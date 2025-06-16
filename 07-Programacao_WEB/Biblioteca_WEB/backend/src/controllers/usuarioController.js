const { Usuario } = require("../models");

const usuarioController = {
    async create(req, res) {
        // ... (função create que já fizemos, sem alterações)
        try {
            const { nome, email, senha, perfil } = req.body;
            const novoUsuario = await Usuario.create({
                nome,
                email,
                senha,
                perfil,
            });
            res.status(201).json(novoUsuario);
        } catch (error) {
            console.error(error);
            res.status(400).json({
                error: "Erro ao criar usuário: " + error.message,
            });
        }
    },

    // --- NOVA FUNÇÃO: Listar todos os usuários ---
    async getAll(req, res) {
        try {
            // Usa o método findAll do Sequelize para buscar todos os registros
            const usuarios = await Usuario.findAll();
            // Retorna a lista de usuários com status 200 (OK)
            res.status(200).json(usuarios);
        } catch (error) {
            console.error(error);
            // Em caso de erro no servidor, retorna 500
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    // --- NOVA FUNÇÃO: Buscar usuário por ID ---
    async getById(req, res) {
        try {
            // Pega o ID que vem como parâmetro na URL (ex: /usuarios/1)
            const { id } = req.params;

            // Usa o método findByPk (Find by Primary Key) para buscar o usuário
            const usuario = await Usuario.findByPk(id);

            // Se o usuário não for encontrado, retorna erro 404 (Not Found)
            if (!usuario) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            // Se encontrou, retorna o usuário com status 200 (OK)
            res.status(200).json(usuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },
    // --- NOVA FUNÇÃO: Atualizar um usuário ---
    async update(req, res) {
        try {
            const { id } = req.params; // Pega o ID da URL
            const { nome, email, senha, perfil } = req.body; // Pega os dados para atualizar

            // Primeiro, verifica se o usuário existe
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            // Atualiza o usuário com os novos dados
            await usuario.update({ nome, email, senha, perfil });

            // Retorna o usuário atualizado
            res.status(200).json(usuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao atualizar usuário" });
        }
    },

    // --- NOVA FUNÇÃO: Deletar um usuário ---
    async delete(req, res) {
        try {
            const { id } = req.params;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            // Deleta o registro do banco de dados
            await usuario.destroy();

            // Retorna uma resposta de sucesso sem conteúdo
            res.status(204).send(); // 204 No Content
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao deletar usuário" });
        }
    },
};

module.exports = usuarioController;
