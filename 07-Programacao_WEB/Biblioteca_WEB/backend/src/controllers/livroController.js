const { Op } = require("sequelize");
const { Livro, Emprestimo, sequelize } = require("../models");

const livroController = {
    /**
     * Cria um novo livro no banco de dados.
     * Rota: POST /livros
     */
    async create(req, res) {
        try {
            const { titulo, autor, quantidade_disponivel } = req.body;
            // Converte o ano de publicação para null se o campo vier vazio
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

    /**
     * Lista todos os livros e adiciona um campo 'podeSerExcluido' para uso no frontend.
     * Rota: GET /livros
     */
    async getAll(req, res) {
        try {
            // 1. Busca todos os livros, ordenando pelos mais recentes primeiro.
            const livros = await Livro.findAll({ order: [["id", "ASC"]] });

            // 2. Busca os IDs de todos os livros que têm empréstimos em andamento.
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

            // 3. Cria um conjunto (Set) com esses IDs para uma busca rápida.
            const livrosComPendencias = new Set(
                emprestimosEmAndamento.map((e) => e.livro_id)
            );

            // 4. Mapeia os resultados, adicionando a flag 'podeSerExcluido'.
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

    /**
     * Busca um livro específico pelo seu ID.
     * Rota: GET /livros/:id
     */
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

    /**
     * Atualiza os dados de um livro existente.
     * Rota: PUT /livros/:id
     */
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

    /**
     * Exclui um livro, se ele não tiver nenhum empréstimo em andamento.
     * Rota: DELETE /livros/:id
     */
    async delete(req, res) {
        try {
            const { id } = req.params;

            // Validação: Verifica se há empréstimos em andamento para este livro.
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
