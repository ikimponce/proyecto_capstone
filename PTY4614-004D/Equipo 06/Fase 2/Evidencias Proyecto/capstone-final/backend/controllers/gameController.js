// controllers/gameController.js
const Game = require('../models/Game');

// Listar TODOS los juegos (activos o no, solo para admin)
const getGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ name: 1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

//Juegos publicos activos
const getActiveGames = async (req, res) => {
  try {
    const games = await Game.find({ active: true })
      .select('name')
      .sort({ name: 1 })
      .lean();

    res.json(games);
  } catch (error) {
    console.error('Error al obtener juegos activos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Crear juego
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

// Editar juego (PUT)
const updateGame = async (req, res) => {
  try {
    const { name, genre, platform, description, image } = req.body;

    let game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    // Verificar si el nombre ya existe en otro juego
    if (name && name !== game.name) {
      const exists = await Game.findOne({ name });
      if (exists) {
        return res.status(400).json({ message: 'El nombre ya está en uso' });
      }
    }

    game = await Game.findByIdAndUpdate(
      req.params.id,
      { name, genre, platform, description, image },
      { new: true }  // Retorna el documento actualizado
    );

    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Desactivar juego (soft delete)
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

// Reactivar juego
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
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getGames,      // ← NUEVO: todos los juegos
  getActiveGames, // ← Juegos publicos activos
  createGame,
  updateGame,    // ← NUEVO: PUT
  deleteGame,
  reactivateGame
};