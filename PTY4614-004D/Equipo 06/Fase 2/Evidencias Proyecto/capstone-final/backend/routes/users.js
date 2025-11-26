//users.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Ruta para obtener el perfil del usuario logueado
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    // DESPUÉS (devuelve 401 → el frontend entiende que debe cerrar sesión)
    if (!user) {
      return res.status(401).json({
        msg: 'Sesión expirada o usuario eliminado. Por favor, inicia sesión nuevamente.'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para actualizar avatar e intención
router.put('/me', auth, async (req, res) => {
  const { avatar, intention } = req.body;
  try {
    const updateData = {};
    if (avatar) updateData.avatar = avatar;
    if (intention) updateData.intention = intention;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

// Opcional: para ver perfil público de otro usuario
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;