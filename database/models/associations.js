const ProfilePicture = require('../models/ProfilePictures.js');
const User = require('../models/User.js');
const Emotion = require('../models/Emotion.js');
const Recommendation = require('../models/Recommendation.js');
const RecommendationSong = require('../models/RecommendationSong.js');
const Song = require('./Song.js');

// USER Foreign key associations
ProfilePicture.hasMany(User, {foreignKey: "idProfilePicture"});
User.belongsTo(ProfilePicture, {foreignKey: "idProfilePicture"});

// RECOMMENDATION Foreign key associations
User.hasMany(Recommendation, {foreignKey: "idUser"});
Recommendation.belongsTo(User, {foreignKey: "idUser"});
Emotion.hasMany(Recommendation, {foreignKey: "idEmotion"});
Recommendation.belongsTo(Emotion, {foreignKey: "idEmotion"});

// RECOMMENDATIONSONG Foreign key associations
Recommendation.hasMany(RecommendationSong, {foreignKey: "idRecommendation"});
RecommendationSong.belongsTo(Recommendation, {foreignKey: "idRecommendation"});
Song.hasMany(RecommendationSong, {foreignKey: "idSong"});
RecommendationSong.belongsTo(Song, {foreignKey: "idSong"}); 