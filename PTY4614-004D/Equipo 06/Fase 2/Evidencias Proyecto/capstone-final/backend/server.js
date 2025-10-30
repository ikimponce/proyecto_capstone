require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const authRoutes = require('./routes/auth')
const groupRoutes = require('./routes/groups')
const chatSocket = require('./sockets/chat')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
})

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB OK'))

chatSocket(io)

const PORT = 5000
server.listen(PORT, () => console.log(`Server en ${PORT}`))