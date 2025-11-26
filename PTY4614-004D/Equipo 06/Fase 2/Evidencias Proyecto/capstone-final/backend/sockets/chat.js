// sockets/chat.js 
const Message = require('../models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // === UNIRSE A LA SALA (nombre compatible con frontend) ===
    socket.on('join-group', (groupId) => {
      const room = `group_${groupId}`;
      socket.join(room);
      console.log(`Usuario ${socket.id} entró a la sala: ${room}`);
    });

    // === SALIR DE LA SALA ===
    socket.on('leave-group', (groupId) => {
      const room = `group_${groupId}`;
      socket.leave(room);
      console.log(`Usuario ${socket.id} salió de: ${room}`);
    });

    // === DESCONEXIÓN ===
    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });

  // === ESTO ES LO QUE USA TU RUTA POST /messages === 
  // Hacemos el emit desde aquí también para que sea consistente
  // (aunque ya lo haces en la ruta, esto es por si quieres centralizar)
};