const { Op } = require("sequelize");
const { Usuario, Emprestimo } = require("../models");
const bcrypt = require("bcrypt");

const usuarioController = {
    /**
     * Registra (cria) um novo usuário, com a senha criptografada.
     * Rota: POST /usuarios
     */
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

            // Nunca retorne a senha, mesmo que seja o hash
            novoUsuario.senha = undefined;
            res.status(201).json(novoUsuario);
        } catch (error) {
            console.error(error);
            res.status(400).json({
                error: "Erro ao criar usuário: " + error.message,
            });
        }
    },

    /**
     * Autentica um usuário, verificando email e senha.
     * Rota: POST /usuarios/login
     */
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

    /**
     * Lista todos os usuários e adiciona um campo 'podeSerExcluido' para uso no frontend.
     * Rota: GET /usuarios
     */
    async getAll(req, res) {
        try {
            // 1. Busca todos os usuários, ordenando pelos id.
            const usuarios = await Usuario.findAll({ order: [["id", "ASC"]] });

            // 2. Busca todos os empréstimos que impedem a exclusão de um usuário.
            const emprestimosEmAndamento = await Emprestimo.findAll({
                where: {
                    status: { [Op.in]: ["ativo", "pendente", "atrasado"] },
                },
                attributes: ["leitor_id"],
            });

            // 3. Cria um conjunto (Set) com os IDs dos leitores que têm pendências.
            const leitoresComPendencias = new Set(
                emprestimosEmAndamento.map((e) => e.leitor_id)
            );

            // 4. Adiciona o campo 'podeSerExcluido' a cada usuário.
            const resultado = usuarios.map((usuario) => {
                const usuarioJSON = usuario.toJSON();
                usuarioJSON.podeSerExcluido = !leitoresComPendencias.has(
                    usuario.id
                );
                // Por segurança, remove a senha de todos os usuários da lista
                usuarioJSON.senha = undefined;
                return usuarioJSON;
            });

            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    /**
     * Busca um usuário específico pelo seu ID.
     * Rota: GET /usuarios/:id
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            usuario.senha = undefined;
            res.status(200).json(usuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    /**
     * Atualiza os dados de um usuário. Se uma nova senha for fornecida, ela será criptografada.
     * Rota: PUT /usuarios/:id
     */
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
            // Se uma nova senha foi enviada, gera o hash e a inclui nos dados a serem atualizados.
            if (senha && senha.trim() !== "") {
                dadosAtualizados.senha = await bcrypt.hash(senha, 10);
            }

            await usuario.update(dadosAtualizados);

            // Busca o usuário atualizado para retornar sem a senha
            const usuarioAtualizado = await Usuario.findByPk(id, {
                attributes: { exclude: ["senha"] }, // Exclui a senha da consulta
            });

            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao atualizar usuário" });
        }
    },

    /**
     * Exclui um usuário, se ele não tiver nenhum empréstimo em andamento.
     * Rota: DELETE /usuarios/:id
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            // Validação: Verifica se o usuário tem pendências.
            const emprestimoEmAndamento = await Emprestimo.findOne({
                where: {
                    leitor_id: id,
                    status: { [Op.in]: ["ativo", "pendente", "atrasado"] },
                },
            });

            if (emprestimoEmAndamento) {
                return res.status(409).json({
                    error: "Não é possível excluir o usuário pois ele possui empréstimos em andamento.",
                });
            }

            await usuario.destroy();
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao deletar usuário" });
        }
    },
};

module.exports = usuarioController;
