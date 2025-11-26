// backend/models/Group.js
const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  game: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPrivate: { type: Boolean, default: false },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  inviteCode: String,

  // AÑADIMOS EL SISTEMA DE VALORACIÓN
  ratings: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      to:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      value: { type: Number, min: 1, max: 5, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model('Group', groupSchema)