// routes/groups.js
const express = require('express');
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { name, description, game, isPrivate } = req.body;
  const inviteCode = isPrivate ? Math.random().toString(36).substring(7) : null;
  const group = await Group.create({
    name, description, game, isPrivate, inviteCode,
    owner: req.user.id,
    members: [req.user.id]
  });
  res.status(201).json(group);
});

router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [
        { members: req.user.id },
        { owner: req.user.id }  // ← AÑADE ESTO
      ]
    }).populate('members', 'username')
     .populate('owner', 'username');  // ← opcional, para mostrar dueño

    res.json(groups);
  } catch (error) {
    console.error('Error en GET /groups:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/:id/join', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });

    if (group.isPrivate && req.body.inviteCode !== group.inviteCode) {
      return res.status(403).json({ message: 'Código inválido' });
    }

    if (!group.members.includes(req.user.id)) {
      group.members.push(req.user.id);
      await group.save(); // ← GUARDA
    }

    // ← DEVUELVE GRUPO CON POPULATE
    const updatedGroup = await Group.findById(group._id)
      .populate('owner', 'username')
      .populate('members', 'username');

    res.json(updatedGroup);
  } catch (error) {
    console.error('Error en join:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.get('/:id/messages', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate({
        path: 'messages',
        populate: { path: 'user', select: 'username' }
      });

    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    const isMember = group.members.some(m => m.toString() === req.user.id.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'No eres miembro' });
    }

    // PROTECCIÓN: Verifica que 'timestamp' exista
    const messages = group.messages.map(m => ({
      _id: m._id,
      user: { _id: m.user._id, username: m.user.username },
      content: m.content,
      timestamp: m.timestamp
    }));

    res.json(messages);
  } catch (error) {
    console.error('Error en /messages:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.get('/search', auth, async (req, res) => {
  try {
    const { game, limit = 20 } = req.query;  // game=Valorant&limit=10

    const query = { 
      members: { $ne: req.user.id },  // Solo grupos que no eres miembro
      isPrivate: false,               // Solo públicos
      game: game || { $exists: true } // Filtrar por game o todos
    };

    const groups = await Group.find(query)
      .populate('owner', 'username')  // Mostrar dueño
      .populate('members', 'username') // Miembros
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });       // Más nuevos primero

    res.json(groups);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;