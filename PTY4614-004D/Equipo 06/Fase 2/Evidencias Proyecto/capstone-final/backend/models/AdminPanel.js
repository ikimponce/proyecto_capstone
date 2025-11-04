const mongoose = require('mongoose')

const adminPanelSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  logs: [{
    action: String,
    target: String,
    timestamp: { type: Date, default: Date.now }
  }],
  settings: {
    maintenanceMode: { type: Boolean, default: false },
    allowRegistrations: { type: Boolean, default: true }
  }
}, { timestamps: true })

module.exports = mongoose.model('AdminPanel', adminPanelSchema)
