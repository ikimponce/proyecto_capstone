// backend/models/User.js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'default.png' },
  role : {type: String, default:'user'},
  games: [String],
  intention: { type: String, enum: ['just-play', 'make-friends'], default: 'just-play' }, // NUEVO RATING
  rating: { type: Number, default: 3.0, min: 1, max: 5 }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)