
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const {
  createGame,
  deleteGame,
  reactivateGame,
  getActiveGames
} = require('../controllers/gameController');

router.get('/', getActiveGames);

router.post('/', auth, isAdmin, createGame);

router.delete('/:id', auth, isAdmin, deleteGame);

router.patch('/:id/reactivate', auth, isAdmin, reactivateGame);

module.exports = router;