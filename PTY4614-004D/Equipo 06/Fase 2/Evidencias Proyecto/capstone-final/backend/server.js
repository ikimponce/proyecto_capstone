require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const authRoutes = require('./routes/auth')
const groupRoutes = require('./routes/groups')
const chatSocket = require('./sockets/chat')
const userRoutes = require('./routes/users'); //usuarios o perfiles
const gameRoutes = require('./routes/games');

const app = express()
 
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
})

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true   // ← si no esta, no funciona en el navegador
}))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/games', require('./routes/games'));
//prueba de ruta
app.use('/api/users', require('./routes/users'));     
app.use('/api/messages', require('./routes/messages'));

//io
app.set('io', io);

app.use(express.static('public')); 
// Ruta API para listar avatares – 
app.get('/api/avatars/list', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const avatarsDir = path.join(__dirname, 'public', 'avatars');

  fs.readdir(avatarsDir, 'utf8', (err, files) => {
    if (err) {
      console.error('Error leyendo avatars:', err);
      return res.status(200).json([]); // ← 200 + JSON limpio
    }

    const images = files
      .filter(f => /\.(png|jpe?g|gif|webp|svg)$/i.test(f))
      .map(f => f.trim())  // ← elimina posibles espacios/BOM
      .filter(Boolean);

    // FORZAMOS JSON LIMPIO SIN BOM NI CARACTERES RAROS
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify(images));
  });
});

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB OK'))

chatSocket(io)

const PORT = 5000
server.listen(PORT, () => console.log(`Server en ${PORT}`))