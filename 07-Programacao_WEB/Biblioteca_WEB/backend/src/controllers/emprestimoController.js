const { Op } = require("sequelize");
const { Emprestimo, Livro, Usuario, sequelize } = require("../models");

const emprestimoController = {
    /**
     * Cria uma nova solicitação de empréstimo (status 'pendente').
     * Realiza múltiplas validações antes de criar o registro e diminuir o estoque do livro.
     */
    async create(req, res) {
        const t = await sequelize.transaction();
        try {
            const { livro_id, leitor_id, data_devolucao_prevista } = req.body;

            // 1. Validação da Data
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

            // 2. Validação do Leitor
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

            // 3. Validação do Livro e Estoque
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

            // 4. Validação de Empréstimo Duplicado
            const emprestimoExistente = await Emprestimo.findOne({
                where: {
                    livro_id: livro_id,
                    leitor_id: leitor_id,
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

            // 5. Execução das Alterações
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

    /**
     * Aprova um empréstimo pendente, mudando seu status para 'ativo'.
     */
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

    /**
     * Reprova um empréstimo pendente, mudando seu status para 'reprovado' e devolvendo o livro ao estoque.
     */
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

            // Devolve o livro ao estoque
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

    /**
     * Devolve um empréstimo (ativo ou atrasado), mudando o status para 'devolvido' e retornando o livro ao estoque.
     */
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

    /**
     * Registra um livro como perdido, mudando o status para 'perdido'. NÃO devolve o livro ao estoque.
     */
    async registrarPerda(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const emprestimo = await Emprestimo.findByPk(id, {
                transaction: t,
            });
            if (!emprestimo) {
                await t.rollback();
                return res
                    .status(404)
                    .json({ error: "Empréstimo não encontrado." });
            }
            if (
                emprestimo.status !== "ativo" &&
                emprestimo.status !== "atrasado"
            ) {
                await t.rollback();
                return res
                    .status(400)
                    .json({
                        error: "Ação não permitida para este status de empréstimo.",
                    });
            }

            emprestimo.status = "perdido";
            await emprestimo.save({ transaction: t });

            await t.commit();
            res.status(200).json(emprestimo);
        } catch (error) {
            await t.rollback();
            console.error(error);
            res.status(500).json({
                error: "Erro ao registrar perda do livro.",
            });
        }
    },

    /**
     * Lista todos os empréstimos do sistema, calculando dinamicamente o status 'atrasado'.
     */
    async getAll(req, res) {
        try {
            const emprestimos = await Emprestimo.findAll({
                include: [
                    { model: Usuario, attributes: ["nome", "email"] },
                    { model: Livro, attributes: ["titulo"] },
                ],
                order: [["id", "ASC"]],
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

    /**
     * Lista todos os empréstimos de um usuário específico.
     */
    async getByUsuario(req, res) {
        try {
            const { leitor_id } = req.params;
            const emprestimos = await Emprestimo.findAll({
                where: { leitor_id: leitor_id },
                include: [{ model: Livro, attributes: ["titulo"] }],
                order: [["id", "ASC"]],
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
};

module.exports = emprestimoController;
