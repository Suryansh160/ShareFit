import { Server } from 'socket.io'
import logger from '../logger.js'
import { registerSignalingHandlers } from './signaling.js'

export function initSocket (httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || '*'
    }
  })

  io.on('connection', socket => {
    logger.info(`Socket connected: ${socket.id}`)

    registerSignalingHandlers(io, socket)

    socket.on('disconnect', reason => {
      logger.info(`Socket disconnected: ${socket.id} (${reason})`)
    })
  })

  return io
}
