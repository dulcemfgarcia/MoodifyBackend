const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "moodify_database",
    "root",
    "",
    {
        host: "127.0.0.1",
        dialect: "mysql",
        logging: false,
        define: {
            freezeTableName: true
        }
    }
);

module.exports = sequelize;