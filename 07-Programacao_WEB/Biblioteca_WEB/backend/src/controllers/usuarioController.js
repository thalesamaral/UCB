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
            // Usa o método findAll do Sequelize para buscar todos os registros
            const usuarios = await Usuario.findAll({ order: [['id', 'ASC']] });
            // Retorna a lista de usuários com status 200 (OK)
            res.status(200).json(usuarios);
        } catch (error) {
            console.error(error);
            // Em caso de erro no servidor, retorna 500
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

            // 1. Verificar se o usuário existe
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            // 2. VERIFICAR SE EXISTEM EMPRÉSTIMOS ATIVOS PARA ESTE USUÁRIO
            const emprestimosAtivos = await Emprestimo.findOne({
                where: {
                    leitor_id: id,
                    status: "ativo",
                },
            });

            if (emprestimosAtivos) {
                // Se encontrou algum empréstimo ativo, bloqueia a exclusão
                return res.status(400).json({
                    error: "Não é possível excluir o usuário pois ele possui empréstimos ativos.",
                });
            }

            // 3. Se não houver empréstimos ativos, deleta o usuário
            await usuario.destroy();

            res.status(204).send(); // Sucesso, sem conteúdo
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao deletar usuário" });
        }
    },
};

module.exports = usuarioController;
