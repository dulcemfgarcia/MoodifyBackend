const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config.js");

class Emotion extends Model {}

Emotion.init(
    {
        idEmotion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        emotion: {
            type: DataTypes.STRING(25),
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "Emotion",
        timestamps: true,
        paranoid: true
    }
);

module.exports = Emotion;