// sockets/chat.js
const Message = require('../models/Message');
const Group = require('../models/Group');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
      console.log(`Usuario ${socket.id} entró al grupo ${groupId}`);
    });

    socket.on('chatMessage', async ({ groupId, message, userId }) => {
      try {
        const newMessage = new Message({
          group: groupId,
          user: userId,
          content: message
        });
        await newMessage.save();

        const group = await Group.findById(groupId);
        group.messages.push(newMessage._id);
        await group.save();

        const populated = await Message.findById(newMessage._id)
          .populate('user', 'username');

        const msgToSend = {
          _id: populated._id,
          user: {
            _id: populated.user._id,
            username: populated.user.username
          },
          content: populated.content,
          timestamp: populated.timestamp
        };

        io.to(groupId).emit('message', msgToSend);
        console.log('Mensaje enviado:', msgToSend);
      } catch (err) {
        console.error('Error en chat:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });
};