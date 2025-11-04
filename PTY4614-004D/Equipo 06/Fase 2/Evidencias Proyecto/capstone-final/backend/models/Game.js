const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  genre: { type: String },
  platform: { type: String },
  description: { type: String },
  image: { type: String }, // URL o nombre de archivo
  active: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Game', gameSchema)