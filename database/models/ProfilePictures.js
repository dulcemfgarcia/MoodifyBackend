const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config.js");

class ProfilePicture extends Model {}

ProfilePicture.init(
    {
        idProfilePicture: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        profilePictureName: {
            type: DataTypes.STRING(25),
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "ProfilePicture",
        timestamps: true,
        paranoid: true
    }
);

module.exports = ProfilePicture;