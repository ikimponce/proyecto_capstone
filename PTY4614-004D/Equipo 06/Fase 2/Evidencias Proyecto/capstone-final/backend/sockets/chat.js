const Message = require('../models/Message')

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinGroup', (groupId) => {
      socket.join(groupId)
    })

    socket.on('sendMessage', async ({ groupId, content, userId }) => {
      const message = await Message.create({ group: groupId, user: userId, content })
      const populated = await Message.findById(message._id).populate('user', 'username')
      io.to(groupId).emit('message', populated)
    })
  })
}