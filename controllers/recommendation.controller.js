require('dotenv').config();
const AWS = require('aws-sdk');
const { Op, Sequelize } = require('sequelize');
const { Emotion, Song, Recommendation, RecommendationSong } = require('../database/models');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const rekognition = new AWS.Rekognition();

const getAnalysis = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Image missing' });
    }

    const base64Image = content.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const params = {
      Image: { Bytes: imageBuffer },
      Attributes: ['ALL']
    };

    const response = await rekognition.detectFaces(params).promise();

    //validación por si no se detectó ningún rostro (si el array está vacío)
    if (!response.FaceDetails.length) {
      return res.status(400).json({ message: 'No face detected' });
    }

    const detectedEmotion = response.FaceDetails[0].Emotions[0].Type.toUpperCase();

    const emotion = await Emotion.findOne({
      where: { emotion: { [Op.like]: detectedEmotion } }
    });

    if (!emotion) {
      return res.status(404).json({ message: 'Emotion not supported' });
    }

    const songs = await Song.findAll({ //Query para obtener las canciones
      where: { emotion: detectedEmotion },
      limit: 5,
      order: Sequelize.literal('RAND()')
    });

    //Almacenar la recomendación en la tabla Recommendation
    const recommendation = await Recommendation.create({
      idUser: 1,
      idEmotion: emotion.idEmotion
    });

    //Almacenar el detalle de la recomendación en la tabla RecommendationSong
    await Promise.all(
      songs.map(song =>
        RecommendationSong.create({
          idRecommendation: recommendation.idRecommendation,
          idSong: song.idSong
        })
      )
    );

    //Respuesta
    res.status(200).json({
      emotion: emotion.emotion,
      songs: songs.map(song => ({
        id: song.idSong,
        title: song.song,
        album: song.album,
        artist: song.artist,
        image: song.albumImageUrl
      }))
    });

  } catch (error) {
    console.error('Error!:', error);
    res.status(500).json({ message: 'Internal rekognition error', error });
  }
};

module.exports = { getAnalysis };