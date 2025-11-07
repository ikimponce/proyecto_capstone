const Game = require('../models/Game');

const createGame = async (req, res) => {
  try {
    const { name, genre, platform, description, image } = req.body;

    const gameExists = await Game.findOne({ name });
    if (gameExists) {
      return res.status(400).json({ message: 'El juego ya existe' });
    }

    const game = await Game.create({
      name,
      genre,
      platform,
      description,
      image
    });

    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    game.active = false;
    await game.save();

    res.json({ message: 'Juego desactivado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const reactivateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    game.active = true;
    await game.save();

    res.json({ message: 'Juego reactivado', game });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getActiveGames = async (req, res) => {
  try {
    const games = await Game.find({ active: true }).sort({ name: 1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  createGame,
  deleteGame,
  reactivateGame,
  getActiveGames
};