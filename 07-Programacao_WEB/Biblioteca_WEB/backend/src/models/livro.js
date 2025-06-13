const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Importa a conexão

const Livro = sequelize.define("Livro", {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false, // Corresponde à restrição "Obrigatório"
    },
    autor: {
        type: DataTypes.STRING,
        allowNull: false, // Corresponde à restrição "Obrigatório"
    },
    ano_publicacao: {
        type: DataTypes.INTEGER,
        allowNull: true, // Corresponde à restrição "Opcional"
    },
    quantidade_disponivel: {
        type: DataTypes.INTEGER,
        allowNull: false, // Corresponde à restrição "Obrigatório"
    },
});

module.exports = Livro;
