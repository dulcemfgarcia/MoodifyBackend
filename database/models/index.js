const sequelize = require("../config.js");
const Emotion = require("./Emotion.js");
const ProfilePicture = require("./ProfilePictures.js");
const User = require("./User.js");
const Recommendation = require("./Recommendation.js");
const RecommendationSong = require("./RecommendationSong.js");
const Song = require("./Song.js");
require("./associations.js");

sequelize.sync({ force: false })
.then(() => {
    console.log("Database synchronized");
}).catch((err) => {
    console.log("Sequelize error:", err);
});

module.exports = { sequelize, Emotion, ProfilePicture, User, Recommendation, RecommendationSong, Song };