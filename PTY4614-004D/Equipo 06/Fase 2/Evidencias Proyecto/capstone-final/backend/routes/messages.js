const express = require('express')
const auth = require('../middleware/auth')
const Message = require('../models/Message')
const router = express.Router()

// Obtener mensajes de un grupo
router.get('/:groupId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate('user', 'username')
      .sort({ createdAt: 1 })
    res.json(messages)
  } catch (err) {
    console.error('Error al obtener mensajes:', err)
    res.status(500).json({ message: 'Error al obtener mensajes' })
  }
})

module.exports = router
