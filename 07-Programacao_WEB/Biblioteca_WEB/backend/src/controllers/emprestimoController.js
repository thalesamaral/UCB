// Importa o 'Op' diretamente da biblioteca sequelize
const { Op } = require("sequelize");
// Importa os models e a instância do sequelize
const { Emprestimo, Livro, Usuario, sequelize } = require("../models");

const emprestimoController = {
    async create(req, res) {
        const t = await sequelize.transaction();
        try {
            const { livro_id, leitor_id, data_devolucao_prevista } = req.body;

            const dataDevolucao = new Date(data_devolucao_prevista);
            const hoje = new Date();
            dataDevolucao.setHours(0, 0, 0, 0);
            hoje.setHours(0, 0, 0, 0);

            if (dataDevolucao <= hoje) {
                await t.rollback();
                return res
                    .status(400)
                    .json({
                        error: "A data de devolução prevista deve ser uma data futura.",
                    });
            }

            const leitor = await Usuario.findByPk(leitor_id, {
                transaction: t,
            });
            if (!leitor) {
                await t.rollback();
                return res.status(404).json({ error: "Leitor não encontrado" });
            }
            if (leitor.perfil !== "leitor") {
                await t.rollback();
                return res
                    .status(403)
                    .json({
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

            const emprestimoExistente = await Emprestimo.findOne({
                where: {
                    livro_id: livro_id,
                    leitor_id: leitor_id,
                    // CORREÇÃO: Usando a sintaxe [Op.in] que é mais limpa e robusta
                    status: { [Op.in]: ["ativo", "pendente"] },
                },
                transaction: t,
            });

            if (emprestimoExistente) {
                await t.rollback();
                return res
                    .status(409)
                    .json({
                        error: "Você já possui um empréstimo ativo ou pendente para este livro.",
                    });
            }

            livro.quantidade_disponivel -= 1;
            await livro.save({ transaction: t });

            const novoEmprestimo = await Emprestimo.create(
                {
                    livro_id,
                    leitor_id,
                    data_emprestimo: new Date(),
                    data_devolucao_prevista,
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

    // A função devolver agora também é transacional para garantir consistência
    async devolver(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const emprestimo = await Emprestimo.findByPk(id, {
                include: Livro,
                transaction: t,
            });
            if (!emprestimo) {
                await t.rollback();
                return res
                    .status(404)
                    .json({ error: "Empréstimo não encontrado" });
            }
            if (
                emprestimo.status !== "ativo" &&
                emprestimo.status !== "atrasado"
            ) {
                await t.rollback();
                return res
                    .status(400)
                    .json({
                        error: "Apenas empréstimos ativos ou atrasados podem ser devolvidos.",
                    });
            }

            emprestimo.status = "devolvido";
            emprestimo.data_devolucao_real = new Date();
            await emprestimo.save({ transaction: t });

            const livro = emprestimo.Livro;
            livro.quantidade_disponivel += 1;
            await livro.save({ transaction: t });

            await t.commit();
            res.status(200).json(emprestimo);
        } catch (error) {
            await t.rollback();
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
            const hoje = new Date();
            const emprestimosAtualizados = emprestimos.map((e) => {
                const emprestimoJSON = e.toJSON();
                if (
                    emprestimoJSON.status === "ativo" &&
                    new Date(emprestimoJSON.data_devolucao_prevista) < hoje
                ) {
                    emprestimoJSON.status = "atrasado";
                }
                return emprestimoJSON;
            });
            res.status(200).json(emprestimosAtualizados);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    async getByUsuario(req, res) {
        try {
            const { leitor_id } = req.params;
            const emprestimos = await Emprestimo.findAll({
                where: { leitor_id: leitor_id },
                include: [{ model: Livro, attributes: ["titulo"] }],
            });
            const hoje = new Date();
            const emprestimosAtualizados = emprestimos.map((e) => {
                const emprestimoJSON = e.toJSON();
                if (
                    emprestimoJSON.status === "ativo" &&
                    new Date(emprestimoJSON.data_devolucao_prevista) < hoje
                ) {
                    emprestimoJSON.status = "atrasado";
                }
                return emprestimoJSON;
            });
            res.status(200).json(emprestimosAtualizados);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    async aprovar(req, res) {
        try {
            const { id } = req.params;
            const emprestimo = await Emprestimo.findByPk(id);
            if (!emprestimo) {
                return res
                    .status(404)
                    .json({ error: "Empréstimo não encontrado." });
            }
            if (emprestimo.status !== "pendente") {
                return res
                    .status(400)
                    .json({
                        error: "Apenas empréstimos pendentes podem ser aprovados.",
                    });
            }
            emprestimo.status = "ativo";
            await emprestimo.save();
            res.status(200).json(emprestimo);
        } catch (error) {
            res.status(500).json({ error: "Erro ao aprovar empréstimo." });
        }
    },

    async reprovar(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const emprestimo = await Emprestimo.findByPk(id, {
                include: Livro,
                transaction: t,
            });
            if (!emprestimo) {
                await t.rollback();
                return res
                    .status(404)
                    .json({ error: "Empréstimo não encontrado." });
            }
            if (emprestimo.status !== "pendente") {
                await t.rollback();
                return res
                    .status(400)
                    .json({
                        error: "Apenas empréstimos pendentes podem ser reprovados.",
                    });
            }
            const livro = emprestimo.Livro;
            livro.quantidade_disponivel += 1;
            await livro.save({ transaction: t });
            emprestimo.status = "reprovado";
            await emprestimo.save({ transaction: t });
            await t.commit();
            res.status(200).json(emprestimo);
        } catch (error) {
            await t.rollback();
            res.status(500).json({ error: "Erro ao reprovar empréstimo." });
        }
    },
};

module.exports = emprestimoController;
