const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config.js");

class Recommendation extends Model {}

Recommendation.init(
    {
        idRecommendation: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
    },
    {
        sequelize,
        modelName: "Recommendation",
        timestamps: true,
        paranoid: true
    }
);

module.exports = Recommendation;