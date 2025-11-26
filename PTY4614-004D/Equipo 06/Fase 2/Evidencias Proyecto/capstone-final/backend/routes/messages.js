const express = require('express')
const auth = require('../middleware/auth')
const Message = require('../models/Message')
const router = express.Router()

// GET: todos los mensajes del grupo
router.get('/:groupId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate('user', 'username avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
});

// POST: enviar mensaje
router.post('/:groupId', auth, async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'El mensaje no puede estar vacío' });
  }

  try {
    const Group = require('../models/Group');
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });

    const isMember = group.members.some(m => m.toString() === req.user.id.toString());
    if (!isMember) return res.status(403).json({ message: 'No eres miembro del grupo' });

    const newMessage = await Message.create({
      group: req.params.groupId,
      user: req.user.id,
      content: content.trim()
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('user', 'username avatar');

    const messageToEmit = {
      ...populatedMessage.toObject(),
      group: req.params.groupId   // ← ESTO HACE QUE EL SOCKET FUNCIONE
    };

    const io = req.app.get('io');
    io.to(`group_${req.params.groupId}`).emit('new-message', messageToEmit);

    res.status(201).json(messageToEmit);
  } catch (err) {
    console.error('Error enviando mensaje:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;