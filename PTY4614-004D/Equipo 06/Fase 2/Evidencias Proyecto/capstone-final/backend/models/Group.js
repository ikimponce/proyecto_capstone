const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  game: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPrivate: { type: Boolean, default: false },
  inviteCode: String,
}, { timestamps: true })

module.exports = mongoose.model('Group', groupSchema)