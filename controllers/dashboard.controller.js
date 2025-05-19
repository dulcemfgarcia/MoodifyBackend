const jwt = require("jsonwebtoken");
const { Recommendation, Emotion } = require('../database/models');
const { Sequelize } = require('sequelize');

const getDashboardData = async (req, res) => {
  try {

    //Funcionalidad para obtener el usuario y validar token por seguridad
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token received" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const allEmotions = await Emotion.findAll({ attributes: ['idEmotion', 'emotion'] });

    // Obtener conteo por emoción del usuario
    const emotionsCount = await Recommendation.findAll({
      where: { idUser: userId },
      attributes: [
        'idEmotion',
        [Sequelize.fn('COUNT', Sequelize.col('idEmotion')), 'count']
      ],
      group: ['idEmotion'],
      raw: true
    });

    // Count de las emociones - 0 si no hay registros aún.
    const emotionMap = {};
    emotionsCount.forEach(e => {
      emotionMap[e.idEmotion] = parseInt(e.count);
    });

    const emotionCounts = allEmotions.map(e => ({
      emotion: e.emotion,
      idEmotion: e.idEmotion,
      count: emotionMap[e.idEmotion] || 0
    }));

    // Count por día de la semana
    const dayCounts = await Recommendation.findAll({
      where: { idUser: userId },
      attributes: [
        [Sequelize.fn('DAYNAME', Sequelize.col('createdAt')), 'day'],
        [Sequelize.fn('COUNT', Sequelize.col('idRecommendation')), 'count']
      ],
      group: ['day'],
      raw: true
    });

    //Emociones positivas o negativas
    const POSITIVE = ["HAPPY", "SURPRISED", "CALM"];
    const NEGATIVE = ["SAD", "ANGRY", "DISGUSTED", "FEAR", "CONFUSED"];

    let positive = 0, negative = 0;
    emotionCounts.forEach(e => {
      const name = e.emotion.toUpperCase();
      if (POSITIVE.includes(name)) positive += e.count;
      else if (NEGATIVE.includes(name)) negative += e.count;
    });

    res.status(200).json({
      emotions: emotionCounts,
      week: dayCounts.map(d => ({ day: d.day, count: parseInt(d.count) })),
      comparison: { positive, negative }
    });
  } catch (error) {
    console.error("Error en dashboard:", error);
    res.status(500).json({ message: "Error al cargar el dashboard" });
  }
};

module.exports = { getDashboardData };