const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config.js");

class User extends Model {}

User.init(
    {
        idUser: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user: {
            type: DataTypes.STRING(25),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING, // 255 characters
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "User",
        timestamps: true,
        paranoid: true
    }
);

module.exports = User;