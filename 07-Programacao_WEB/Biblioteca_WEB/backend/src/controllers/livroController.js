const { Livro } = require("../models");

const livroController = {
    // --- Criar um novo livro ---
    async create(req, res) {
        try {
            // Os campos vêm do documento de descrição do projeto
            const { titulo, autor, quantidade_disponivel } = req.body;
            const ano_publicacao = req.body.ano_publicacao || null;
            const novoLivro = await Livro.create({
                titulo,
                autor,
                ano_publicacao,
                quantidade_disponivel,
            });
            res.status(201).json(novoLivro);
        } catch (error) {
            console.error(error);
            res.status(400).json({
                error: "Erro ao criar livro: " + error.message,
            });
        }
    },

    // --- Listar todos os livros ---
    async getAll(req, res) {
        try {
            const livros = await Livro.findAll({ order: [["id", "ASC"]] });
            res.status(200).json(livros);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    // --- Buscar livro por ID ---
    async getById(req, res) {
        try {
            const { id } = req.params;
            const livro = await Livro.findByPk(id);

            if (!livro) {
                return res.status(404).json({ error: "Livro não encontrado" });
            }
            res.status(200).json(livro);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    // --- Atualizar um livro ---
    async update(req, res) {
        try {
            const { id } = req.params;
            const { titulo, autor, quantidade_disponivel } = req.body;
            const ano_publicacao = req.body.ano_publicacao || null;
            const livro = await Livro.findByPk(id);
            if (!livro) {
                return res.status(404).json({ error: "Livro não encontrado" });
            }

            await livro.update({
                titulo,
                autor,
                ano_publicacao,
                quantidade_disponivel,
            });
            res.status(200).json(livro);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao atualizar livro" });
        }
    },

    // --- Deletar um livro ---
    async delete(req, res) {
        try {
            const { id } = req.params;
            const livro = await Livro.findByPk(id);

            if (!livro) {
                return res.status(404).json({ error: "Livro não encontrado" });
            }

            await livro.destroy();
            res.status(204).send(); // Sucesso, sem conteúdo
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao deletar livro" });
        }
    },
};

module.exports = livroController;
