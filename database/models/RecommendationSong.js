const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config.js");

class RecommendationSong extends Model {}

RecommendationSong.init(
    {
        idRecommendationSong: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        sequelize,
        modelName: "RecommendationSong",
        timestamps: true,
        paranoid: true
    }
);

module.exports = RecommendationSong;