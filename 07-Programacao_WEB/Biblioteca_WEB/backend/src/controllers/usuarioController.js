const { Op } = require("sequelize");
const { Usuario, Emprestimo } = require("../models");
const bcrypt = require("bcrypt");

const usuarioController = {
    async create(req, res) {
        try {
            const { nome, email, senha, perfil } = req.body;
            const senhaHash = await bcrypt.hash(senha, 10);
            const novoUsuario = await Usuario.create({
                nome,
                email,
                senha: senhaHash,
                perfil,
            });
            novoUsuario.senha = undefined;
            res.status(201).json(novoUsuario);
        } catch (error) {
            console.error(error);
            res.status(400).json({
                error: "Erro ao criar usuário: " + error.message,
            });
        }
    },

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) {
                return res
                    .status(401)
                    .json({ error: "Email ou senha inválidos" });
            }
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res
                    .status(401)
                    .json({ error: "Email ou senha inválidos" });
            }
            usuario.senha = undefined;
            res.status(200).json(usuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, perfil } = req.body;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            const dadosAtualizados = { nome, email, perfil };

            if (senha && senha.trim() !== "") {
                dadosAtualizados.senha = await bcrypt.hash(senha, 10);
            }

            await usuario.update(dadosAtualizados);

            // Busca o usuário atualizado para retornar sem a senha
            const usuarioAtualizado = await Usuario.findByPk(id);
            usuarioAtualizado.senha = undefined;

            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao atualizar usuário" });
        }
    },

    async getAll(req, res) {
        try {
            // 1. Busca todos os usuários
            const usuarios = await Usuario.findAll({ order: [["id", "ASC"]] });

            // 2. Busca todos os empréstimos que impedem a exclusão
            const emprestimosEmAndamento = await Emprestimo.findAll({
                where: {
                    status: { [Op.in]: ["ativo", "pendente", "atrasado"] },
                },
                attributes: ["leitor_id"], // Só precisamos do ID do leitor
            });

            // 3. Cria um conjunto (Set) com os IDs dos leitores que têm pendências.
            // Usar um Set é muito mais rápido para fazer buscas.
            const leitoresComPendencias = new Set(
                emprestimosEmAndamento.map((e) => e.leitor_id)
            );

            // 4. Adiciona o campo 'podeSerExcluido' a cada usuário
            const resultado = usuarios.map((usuario) => {
                const usuarioJSON = usuario.toJSON(); // Converte para um objeto simples
                usuarioJSON.podeSerExcluido = !leitoresComPendencias.has(
                    usuario.id
                );
                return usuarioJSON;
            });

            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

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

    async delete(req, res) {
        try {
            const { id } = req.params;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            // --- LÓGICA ATUALIZADA ---
            // Procura se existe algum empréstimo que NÃO esteja finalizado ('devolvido' ou 'reprovado')
            const emprestimoEmAndamento = await Emprestimo.findOne({
                where: {
                    leitor_id: id,
                    status: {
                        [Op.in]: ["ativo", "pendente", "atrasado"], // Procura por qualquer um destes status
                    },
                },
            });

            if (emprestimoEmAndamento) {
                return res.status(409).json({
                    error: "Não é possível excluir o usuário pois ele possui empréstimos em andamento.",
                });
            }

            // Se não encontrou pendências, pode excluir
            await usuario.destroy();

            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao deletar usuário" });
        }
    },
};

module.exports = usuarioController;
