// routes/groups.js
const express = require('express');
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();

// Compartir socket.io
router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

// 1. MIS GRUPOS (la que usaba el Dashboard) - RECUPERADA Y MEJORADA
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [
        { members: req.user.id },
        { owner: req.user.id }
      ]
    })
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar rating')
      .sort({ updatedAt: -1 });

    res.json(groups);
  } catch (error) {
    console.error('Error en GET /api/groups (mis grupos):', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// 2. CREAR GRUPO
router.post('/', auth, async (req, res) => {
  const { name, description, game, isPrivate } = req.body;
  const inviteCode = isPrivate ? Math.random().toString(36).substring(7) : null;

  try {
    const group = await Group.create({
      name, description, game, isPrivate, inviteCode,
      owner: req.user.id,
      members: [req.user.id],
      ratings: []
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar rating');

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error('Error creando grupo:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// 3. BUSCAR GRUPOS PÚBLICOS (mejorada)
router.get('/search', auth, async (req, res) => {
  try {
    const { game } = req.query;
    const query = { isPrivate: false };

    if (game && game !== 'Todos los juegos' && game.trim() !== '') {
      query.game = game;
    }

    const groups = await Group.find(query)
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar rating')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(groups);
  } catch (error) {
    console.error('Error en /groups/search:', error);
    res.status(500).json({ message: 'Error al buscar grupos' });
  }
});

// 4. OBTENER UN GRUPO POR ID
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar rating');

    if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });

    const isMember = group.members.some(m => m._id.toString() === req.user.id);
    const isOwner = group.owner._id.toString() === req.user.id;

    if (group.isPrivate && !isMember && !isOwner) {
      return res.status(403).json({ message: 'Grupo privado' });
    }

    res.json(group);
  } catch (error) {
    console.error('Error GET /groups/:id:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// 5. OBTENER MENSAJES DEL GRUPO (tu versión original mejorada)
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate({
        path: 'messages',
        populate: { path: 'user', select: 'username avatar' }
      });

    if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });

    const isMember = group.members.some(m => m.toString() === req.user.id.toString());
    if (!isMember) return res.status(403).json({ message: 'No eres miembro' });

    res.json(group.messages || []);
  } catch (error) {
    console.error('Error en /:id/messages:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// 6. UNIRSE A GRUPO
router.post('/:id/join', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });

    if (group.isPrivate && req.body.inviteCode !== group.inviteCode) {
      return res.status(403).json({ message: 'Código inválido' });
    }

    if (!group.members.includes(req.user.id)) {
      group.members.push(req.user.id);
      await group.save();
    }

    const updatedGroup = await Group.findById(group._id)
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar rating');

    res.json(updatedGroup);
  } catch (error) {
    console.error('Error en join:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// 7. SALIR DEL GRUPO
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });

    group.members = group.members.filter(m => m.toString() !== req.user.id.toString());
    await group.save();

    res.json({ message: 'Has salido del grupo' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// 8. VALORAR JUGADOR + NOTIFICACIONES EN TIEMPO REAL
router.post('/:id/rate', auth, async (req, res) => {
  const { targetUserId, stars } = req.body;
  if (!stars || stars < 1 || stars > 5) {
    return res.status(400).json({ message: 'Estrellas de 1 a 5' });
  }

  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });

    const isMember = group.members.some(m => m.toString() === req.user.id.toString());
    if (!isMember) return res.status(403).json({ message: 'No estás en el grupo' });

    if (!group.members.some(m => m.toString() === targetUserId)) {
      return res.status(400).json({ message: 'El usuario no está en el grupo' });
    }

    if (targetUserId === req.user.id.toString()) {
      return res.status(400).json({ message: 'No puedes valorarte a ti mismo' });
    }

    // Eliminar valoración anterior
    group.ratings = group.ratings.filter(
      r => !(r.from.toString() === req.user.id.toString() && r.to.toString() === targetUserId)
    );

    // Añadir nueva
    group.ratings.push({ from: req.user.id, to: targetUserId, value: stars });
    await group.save();

    // Calcular nuevo rating promedio
    const result = await Group.aggregate([
      { $unwind: '$ratings' },
      { $match: { 'ratings.to': new mongoose.Types.ObjectId(targetUserId) } },
      { $group: { _id: null, avg: { $avg: '$ratings.value' } } }
    ]);

    const newRating = result.length > 0 ? Number(result[0].avg.toFixed(1)) : 3.0;
    await User.findByIdAndUpdate(targetUserId, { rating: newRating });

    // NOTIFICACIÓN EN TIEMPO REAL
    const ratedUser = await User.findById(targetUserId).select('username');
    req.io.to(`user_${targetUserId}`).emit('new-rating', {
      from: req.user.username || 'Alguien',
      stars,
      newRating,
      message: stars === 5 
        ? `¡${req.user.username} te dio 5 ESTRELLAS! ¡ERES UN GOAT!` 
        : `${req.user.username} te dio ${stars} estrellas`
    });

    if (stars === 5) {
      req.io.to(`user_${targetUserId}`).emit('five-stars', {
        from: req.user.username,
        groupName: group.name
      });
    }

    res.json({ message: 'Valoración enviada', newRating });
  } catch (error) {
    console.error('Error en rate:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;