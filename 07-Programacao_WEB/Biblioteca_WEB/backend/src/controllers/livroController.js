const { Op } = require("sequelize");
const { Livro, Emprestimo, sequelize } = require("../models");

const livroController = {
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

    // --- FUNÇÃO GETALL ATUALIZADA ---
    // Agora verifica apenas empréstimos em andamento para desabilitar o botão
    async getAll(req, res) {
        try {
            const livros = await Livro.findAll({ order: [["id", "ASC"]] });

            const emprestimosEmAndamento = await Emprestimo.findAll({
                where: {
                    status: { [Op.in]: ["ativo", "pendente", "atrasado"] },
                },
                attributes: [
                    [
                        sequelize.fn("DISTINCT", sequelize.col("livro_id")),
                        "livro_id",
                    ],
                ],
            });

            const livrosComPendencias = new Set(
                emprestimosEmAndamento.map((e) => e.livro_id)
            );

            const resultado = livros.map((livro) => {
                const livroJSON = livro.toJSON();
                livroJSON.podeSerExcluido = !livrosComPendencias.has(livro.id);
                return livroJSON;
            });

            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

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

    // --- FUNÇÃO DELETE ATUALIZADA ---
    // Agora só bloqueia a exclusão se houver empréstimos em andamento
    async delete(req, res) {
        try {
            const { id } = req.params;

            const emprestimoEmAndamento = await Emprestimo.findOne({
                where: {
                    livro_id: id,
                    status: { [Op.in]: ["ativo", "pendente", "atrasado"] },
                },
            });

            if (emprestimoEmAndamento) {
                return res.status(409).json({
                    error: "Não é possível excluir o livro, pois ele está associado a empréstimos em andamento.",
                });
            }

            const livro = await Livro.findByPk(id);
            if (!livro) {
                return res.status(404).json({ error: "Livro não encontrado" });
            }

            await livro.destroy();
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao deletar livro" });
        }
    },
};

module.exports = livroController;
