const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Importa a conexão

const Livro = sequelize.define("Livro", {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false, // "Obrigatório"
    },
    autor: {
        type: DataTypes.STRING,
        allowNull: false, // "Obrigatório"
    },
    ano_publicacao: {
        type: DataTypes.INTEGER,
        allowNull: true, // "Opcional"
    },
    quantidade_disponivel: {
        type: DataTypes.INTEGER,
        allowNull: false, // "Obrigatório"
    },
});

module.exports = Livro;
