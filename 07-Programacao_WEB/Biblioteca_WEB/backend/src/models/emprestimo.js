const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Importa a conexão

const Emprestimo = sequelize.define("Emprestimo", {
    data_emprestimo: {
        type: DataTypes.DATE,
        allowNull: false, // Corresponde à restrição "Obrigatório"
    },
    data_devolucao_prevista: {
        type: DataTypes.DATE,
        allowNull: false, // Corresponde à restrição "Obrigatório"
    },
    data_devolucao_real: {
        type: DataTypes.DATE,
        allowNull: true, // Corresponde à restrição "Opcional"
    },
    status: {
        type: DataTypes.ENUM(
            "ativo",
            "devolvido",
            "atrasado",
            "pendente",
            "reprovado",
            "perdido"
        ),
        allowNull: false, // Corresponde à restrição "Obrigatório"
        defaultValue: "pendente",
    },
});

module.exports = Emprestimo;
