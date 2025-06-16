const { Emprestimo, Livro, Usuario, sequelize } = require("../models");

const emprestimoController = {
    async create(req, res) {
        const t = await sequelize.transaction();
        try {
            const { livro_id, leitor_id, data_devolucao_prevista } = req.body;
            const leitor = await Usuario.findByPk(leitor_id, {
                transaction: t,
            });
            if (!leitor) {
                await t.rollback();
                return res.status(404).json({ error: "Leitor não encontrado" });
            }
            if (leitor.perfil !== "leitor") {
                await t.rollback();
                return res.status(403).json({
                    error: "Apenas usuários com perfil de leitor podem pegar livros emprestados.",
                });
            }
            const livro = await Livro.findByPk(livro_id, { transaction: t });
            if (!livro) {
                await t.rollback();
                return res.status(404).json({ error: "Livro não encontrado" });
            }
            if (livro.quantidade_disponivel <= 0) {
                await t.rollback();
                return res
                    .status(400)
                    .json({ error: "Livro sem estoque disponível" });
            }

            // --- ADICIONE A NOVA VERIFICAÇÃO AQUI ---
            const emprestimoExistente = await Emprestimo.findOne({
                where: {
                    livro_id: livro_id,
                    leitor_id: leitor_id,
                    status: "ativo",
                },
                transaction: t,
            });

            if (emprestimoExistente) {
                await t.rollback();
                // 409 Conflict é um bom status para este caso
                return res
                    .status(409)
                    .json({
                        error: "Você já possui um empréstimo ativo para este livro.",
                    });
            }
            // --- FIM DA NOVA VERIFICAÇÃO ---

            livro.quantidade_disponivel -= 1;
            await livro.save({ transaction: t });
            const novoEmprestimo = await Emprestimo.create(
                {
                    livro_id,
                    leitor_id,
                    data_emprestimo: new Date(),
                    data_devolucao_prevista,
                    status: "ativo",
                },
                { transaction: t }
            );
            await t.commit();
            res.status(201).json(novoEmprestimo);
        } catch (error) {
            await t.rollback();
            console.error(error);
            res.status(500).json({
                error: "Erro ao criar empréstimo: " + error.message,
            });
        }
    },

    async devolver(req, res) {
        try {
            const { id } = req.params;
            const emprestimo = await Emprestimo.findByPk(id, {
                include: Livro,
            });
            if (!emprestimo) {
                return res
                    .status(404)
                    .json({ error: "Empréstimo não encontrado" });
            }
            if (emprestimo.status === "devolvido") {
                return res
                    .status(400)
                    .json({ error: "Este empréstimo já foi devolvido" });
            }
            emprestimo.status = "devolvido";
            emprestimo.data_devolucao_real = new Date();
            await emprestimo.save();
            const livro = emprestimo.Livro;
            livro.quantidade_disponivel += 1;
            await livro.save();
            res.status(200).json(emprestimo);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Erro ao processar devolução: " + error.message,
            });
        }
    },

    async getAll(req, res) {
        try {
            const emprestimos = await Emprestimo.findAll({
                include: [
                    { model: Usuario, attributes: ["nome", "email"] },
                    { model: Livro, attributes: ["titulo"] },
                ],
            });
            res.status(200).json(emprestimos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    // --- FUNÇÃO ADICIONADA ---
    async getByUsuario(req, res) {
        try {
            const { leitor_id } = req.params;
            const emprestimos = await Emprestimo.findAll({
                where: { leitor_id: leitor_id },
                include: [{ model: Livro, attributes: ["titulo"] }],
            });
            res.status(200).json(emprestimos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },
};

module.exports = emprestimoController;
