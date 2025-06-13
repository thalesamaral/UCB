const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Supondo que a conexão está em config/database.js

const Usuario = sequelize.define("Usuario", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    perfil: {
        type: DataTypes.ENUM("bibliotecario", "leitor"),
        allowNull: false,
    },
});

module.exports = Usuario;
