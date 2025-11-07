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
}, { timestamps: true })

module.exports = mongoose.model('Group', groupSchema)