const { Emprestimo, Livro, Usuario, sequelize } = require("../models"); // <<< IMPORTANTE: adicione o sequelize
const { Op } = require("sequelize");

const emprestimoController = {
    // --- VERSÃO CORRIGIDA da função create ---
    async create(req, res) {
        // Inicia uma transação gerenciada pelo Sequelize
        const t = await sequelize.transaction();

        try {
            const { livro_id, leitor_id, data_devolucao_prevista } = req.body;

            // 1. Encontrar o livro DENTRO da transação
            const livro = await Livro.findByPk(livro_id, { transaction: t });

            if (!livro) {
                // Se não encontrar o livro, desfaz a transação e retorna o erro
                await t.rollback();
                return res.status(404).json({ error: "Livro não encontrado" });
            }
            if (livro.quantidade_disponivel <= 0) {
                await t.rollback();
                return res
                    .status(400)
                    .json({ error: "Livro sem estoque disponível" });
            }

            // 2. Diminuir o estoque e salvar DENTRO da transação
            livro.quantidade_disponivel -= 1;
            await livro.save({ transaction: t });

            // 3. Criar o empréstimo DENTRO da transação
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

            // 4. Se tudo deu certo, confirma a transação (salva tudo permanentemente)
            await t.commit();

            res.status(201).json(novoEmprestimo);
        } catch (error) {
            // 5. Se qualquer uma das operações acima falhar, desfaz TUDO
            await t.rollback();
            console.error(error);
            res.status(500).json({
                error: "Erro ao criar empréstimo: " + error.message,
            });
        }
    },

    // --- Devolver um empréstimo (um bibliotecário aprova a devolução) ---
    async devolver(req, res) {
        try {
            const { id } = req.params; // ID do empréstimo

            // 1. Encontrar o empréstimo e incluir o livro associado
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

            // 2. Atualizar o status do empréstimo
            emprestimo.status = "devolvido";
            emprestimo.data_devolucao_real = new Date();
            await emprestimo.save();

            // 3. Aumentar a quantidade disponível do livro
            const livro = emprestimo.Livro; // Acessa o livro incluído
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

    // --- Listar todos os empréstimos (para o bibliotecário) ---
    async getAll(req, res) {
        try {
            // Inclui os dados do Usuário e do Livro em cada empréstimo
            const emprestimos = await Emprestimo.findAll({
                include: [
                    { model: Usuario, attributes: ["nome", "email"] }, // Pega apenas alguns campos do usuário
                    { model: Livro, attributes: ["titulo"] }, // Pega apenas o título do livro
                ],
            });
            res.status(200).json(emprestimos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },
};

module.exports = emprestimoController;
