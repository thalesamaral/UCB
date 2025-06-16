const { Usuario } = require("../models");
const bcrypt = require("bcrypt");

const usuarioController = {
    async create(req, res) {
        try {
            const { nome, email, senha, perfil } = req.body;

            // Gera o hash da senha antes de salvar
            const senhaHash = await bcrypt.hash(senha, 10); // O "10" é o custo do hash

            const novoUsuario = await Usuario.create({
                nome,
                email,
                senha: senhaHash,
                perfil,
            });

            // Remove a senha da resposta para segurança
            novoUsuario.senha = undefined;

            res.status(201).json(novoUsuario);
        } catch (error) {
            console.error(error);
            res.status(400).json({
                error: "Erro ao criar usuário: " + error.message,
            });
        }
    },

    // --- NOVA FUNÇÃO DE LOGIN ---
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            // 1. Procura o usuário pelo email
            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) {
                // Se não encontrar o email, retorna erro 401 (Não Autorizado)
                return res
                    .status(401)
                    .json({ error: "Email ou senha inválidos" });
            }

            // 2. Compara a senha enviada com o hash salvo no banco
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                // Se a senha não bater, retorna o mesmo erro para não dar dicas a atacantes
                return res
                    .status(401)
                    .json({ error: "Email ou senha inválidos" });
            }

            // 3. Se tudo estiver correto, envia os dados do usuário (sem a senha)
            usuario.senha = undefined;
            res.status(200).json(usuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    // --- NOVA FUNÇÃO: Listar todos os usuários ---
    async getAll(req, res) {
        try {
            // Usa o método findAll do Sequelize para buscar todos os registros
            const usuarios = await Usuario.findAll();
            // Retorna a lista de usuários com status 200 (OK)
            res.status(200).json(usuarios);
        } catch (error) {
            console.error(error);
            // Em caso de erro no servidor, retorna 500
            res.status(500).json({ error: "Erro no servidor" });
        }
    },

    // --- NOVA FUNÇÃO: Buscar usuário por ID ---
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
    // --- NOVA FUNÇÃO: Atualizar um usuário ---
    async update(req, res) {
        try {
            const { id } = req.params; // Pega o ID da URL
            const { nome, email, senha, perfil } = req.body; // Pega os dados para atualizar

            // Primeiro, verifica se o usuário existe
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            // Atualiza o usuário com os novos dados
            await usuario.update({ nome, email, senha, perfil });

            // Retorna o usuário atualizado
            res.status(200).json(usuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao atualizar usuário" });
        }
    },

    // --- NOVA FUNÇÃO: Deletar um usuário ---
    async delete(req, res) {
        try {
            const { id } = req.params;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            // Deleta o registro do banco de dados
            await usuario.destroy();

            // Retorna uma resposta de sucesso sem conteúdo
            res.status(204).send(); // 204 No Content
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao deletar usuário" });
        }
    },
};

module.exports = usuarioController;
