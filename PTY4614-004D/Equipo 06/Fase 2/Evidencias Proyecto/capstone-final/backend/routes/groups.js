const express = require('express')
const auth = require('../middleware/auth')
const Group = require('../models/Group')
const router = express.Router()

router.post('/', auth, async (req, res) => {
  const { name, description, game, isPrivate } = req.body
  const inviteCode = isPrivate ? Math.random().toString(36).substring(7) : null
  const group = await Group.create({
    name, description, game, isPrivate, inviteCode,
    owner: req.user.id,
    members: [req.user.id]
  })
  res.status(201).json(group)
})

router.get('/', auth, async (req, res) => {
  const groups = await Group.find({ members: req.user.id }).populate('members', 'username')
  res.json(groups)
})

router.post('/:id/join', auth, async (req, res) => {
  const group = await Group.findById(req.params.id)
  if (!group) return res.status(404).json({ message: 'Grupo no encontrado' })

  if (group.isPrivate && req.body.inviteCode !== group.inviteCode) {
    return res.status(403).json({ message: 'Código inválido' })
  }

  if (!group.members.includes(req.user.id)) {
    group.members.push(req.user.id)
    await group.save()
  }
  res.json(group)
})

module.exports = router