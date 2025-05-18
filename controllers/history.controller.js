const { Recommendation, RecommendationSong, Song, Emotion } = require('../database/models');

const getHistory = async (req, res) => {
  try {
    const userId = 1; //POR CORREGIR: el id del user logueado
    const { feeling } = req.query;

    const includes = [
      {
        model: Emotion,
        attributes: ["emotion"],
      },
      {
        model: RecommendationSong,
        include: [
          {
            model: Song,
            attributes: ["song", "artist"]
          }
        ]
      }
    ];

    const where = {
      idUser: userId,
    };

    // Filtro por emoción
    if (feeling) { //Aquí leemos si dentro del request viene lleno el "feeling". Si no, devuelve todas las recomendaciones, si sí, filtra por la emoción con un where.
      includes[0].where = { emotion: feeling };
    }

    const recommendations = await Recommendation.findAll({
      where,
      include: includes,
      order: [["createdAt", "DESC"]]
    });

    const formatted = recommendations.flatMap((rec) =>
      rec.RecommendationSongs.map((rs) => ({
        feeling: rec.Emotion.emotion,
        song: rs.Song.song,
        artist: rs.Song.artist,
        date: rec.createdAt.toISOString().split("T")[0] //Conversión de la fecha para extraer solo el format YYYY-MM-DD
      }))
    );

    res.json(formatted);
  } catch (error) {
    console.error("Error!", error);
    res.status(500).json({ message: "Hubo un error al procesar su solicitud." });
  }
};

module.exports = { getHistory };
