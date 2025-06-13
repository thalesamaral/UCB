const { Sequelize } = require("sequelize");

// Substitua pelos seus dados!
const sequelize = new Sequelize(
    "biblioteca-web",
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: "localhost",
        dialect: "postgres", // Informa ao Sequelize que estamos usando PostgreSQL
    }
);

// Testar a conexão
async function testarConexao() {
    try {
        await sequelize.authenticate();
        console.log(
            "Conexão com o banco de dados PostgreSQL estabelecida com sucesso!"
        );
    } catch (error) {
        console.error("Não foi possível conectar ao banco de dados:", error);
    }
}

// Chamamos a função de teste
testarConexao();

module.exports = sequelize;
