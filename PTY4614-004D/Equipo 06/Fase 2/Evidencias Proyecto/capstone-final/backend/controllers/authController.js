const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

exports.register = async (req, res) => {
  const { username, email, password } = req.body
  const exists = await User.findOne({ $or: [{ email }, { username }] })
  if (exists) return res.status(400).json({ message: 'Usuario ya existe' })

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ username, email, password: hashed })

  res.status(201).json({
    _id: user._id,
    username: user.username,
    token: generateToken(user._id),
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Credenciales inválidas' })
  }

  res.json({
    _id: user._id,
    username: user.username,
    token: generateToken(user._id),
  })
}