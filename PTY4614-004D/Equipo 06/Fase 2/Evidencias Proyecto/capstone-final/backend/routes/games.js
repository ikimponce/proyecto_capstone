// routes/games.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const {
  getGames,      // ← Todos los juegos
  getActiveGames,
  createGame,
  updateGame,    // ← PUT
  deleteGame,
  reactivateGame
} = require('../controllers/gameController');

//ruta de juegos publicos
router.get('/active', getActiveGames);  // ← SIN auth, SIN isAdmin

// GET /api/games → todos los juegos (admin)
router.get('/', auth, isAdmin, getGames);

// POST /api/games
router.post('/', auth, isAdmin, createGame);

// PUT /api/games/:id → EDITAR
router.put('/:id', auth, isAdmin, updateGame);

// DELETE /api/games/:id → desactivar
router.delete('/:id', auth, isAdmin, deleteGame);

// PATCH /api/games/:id/reactivate
router.patch('/:id/reactivate', auth, isAdmin, reactivateGame);

module.exports = router;