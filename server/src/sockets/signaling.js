import logger from '../logger.js'

export function registerSignalingHandlers (io, socket) {
  // Join a room - each room represents one peer-to-peer session
  socket.on('join-room', roomId => {
    const room = io.sockets.adapter.rooms.get(roomId)

    // Room already has 2 users
    if (room && room.size >= 2) {
      logger.info(`Room ${roomId} is full. Rejecting ${socket.id}`)

      socket.emit('room-full', {
        roomId,
        message: 'This transfer room is already full.'
      })

      return
    }

    socket.join(roomId)

    logger.info(`Socket ${socket.id} joined room ${roomId}`)

    // Tell the existing peer that someone joined
    socket.to(roomId).emit('user-joined', {
      socketId: socket.id
    })
  })

  // Relay an SDP offer to the other peer in the room
  socket.on('offer', ({ roomId, offer }) => {
    logger.info(`Relaying offer from ${socket.id} in room ${roomId}`)
    socket.to(roomId).emit('offer', { socketId: socket.id, offer })
  })

  // Relay an SDP answer back to the offering peer
  socket.on('answer', ({ roomId, answer }) => {
    logger.info(`Relaying answer from ${socket.id} in room ${roomId}`)
    socket.to(roomId).emit('answer', { socketId: socket.id, answer })
  })

  // Relay ICE candidates between peers
  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', { socketId: socket.id, candidate })
  })

  // Notify room when a peer leaves intentionally
  socket.on('leave-room', roomId => {
    socket.leave(roomId)
    logger.info(`Socket ${socket.id} left room ${roomId}`)
    socket.to(roomId).emit('user-left', { socketId: socket.id })
  })

  // Handle unexpected disconnects (tab closed, refresh, network drop, etc.)
  // 'disconnecting' fires BEFORE socket.io removes the socket from its rooms,
  // so socket.rooms is still populated here. 'disconnect' would be too late.
  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms].filter(roomId => roomId !== socket.id)

    rooms.forEach(roomId => {
      logger.info(`Socket ${socket.id} disconnected from room ${roomId}`)
      socket.to(roomId).emit('user-left', { socketId: socket.id })
    })
  })
}
