const sequelize = require("../config/database");
const Usuario = require("./usuario");
const Livro = require("./livro");
const Emprestimo = require("./emprestimo");

// Um Leitor (Usuário) pode ter vários Empréstimos
Usuario.hasMany(Emprestimo, { foreignKey: "leitor_id" });
Emprestimo.belongsTo(Usuario, { foreignKey: "leitor_id" });

// Um Livro pode estar em vários Empréstimos
Livro.hasMany(Emprestimo, { foreignKey: "livro_id" });
Emprestimo.belongsTo(Livro, { foreignKey: "livro_id" });

async function syncDatabase() {
    try {
        // O { force: false } garante que as tabelas não sejam recriadas a cada vez.
        // Use { force: true } em desenvolvimento para recriar as tabelas (apaga os dados!).
        await sequelize.sync({ force: false });
        console.log("Tabelas sincronizadas com o banco de dados.");
    } catch (error) {
        console.error("Erro ao sincronizar as tabelas:", error);
    }
}

module.exports = {
    sequelize,
    Usuario,
    Livro,
    Emprestimo,
    syncDatabase,
};
