const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "moodify_database",
    "admin",
    "admin1234",
    {
        host: "awseb-e-3sgurkmbpi-stack-awsebrdsdatabase-vz4b0batrit2.c636yo0s65kg.us-east-1.rds.amazonaws.com",
        dialect: "mysql",
        logging: false,
        define: {
            freezeTableName: true
        }
    }
);

module.exports = sequelize;