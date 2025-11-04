// routes/games.js
const express = require('express')
const Game = require('../models/Game')
const router = express.Router()

router.get('/', async (req, res) => {
  const games = await Game.find()
  res.json(games)
})

module.exports = router
