const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "biblioteca-web",
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: "localhost",
        dialect: "postgres", // Informa ao Sequelize que estamos usando PostgreSQL
    }
);

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

testarConexao();

module.exports = sequelize;
