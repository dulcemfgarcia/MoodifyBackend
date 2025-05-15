const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config.js");

class Song extends Model {}

Song.init(
    {
        idSong: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        song: {
            type: DataTypes.STRING,
            allowNull: false,  
        },
        album: {
            type: DataTypes.STRING,
            allowNull: false,  
        },
        artist: {
            type: DataTypes.STRING,
            allowNull: false,  
        },
        spotifyIdUrl: {
            type: DataTypes.TEXT,
            allowNull: false,  
        },
        albumImageUrl: {
            type: DataTypes.TEXT,
            allowNull: false,  
        }
    },
    {
        sequelize,
        modelName: "Song",
        timestamps: true,
        paranoid: true
    }
);

module.exports = Song;