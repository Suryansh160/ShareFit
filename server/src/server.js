import 'dotenv/config'
import express from 'express'
import http from 'http'
import logger from './logger.js'
import { getIceServers } from './config/iceServers.js'
import { initSocket } from './sockets/index.js'
import cors from 'cors'

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*'
  })
)

const server = http.createServer(app)
const PORT = process.env.PORT || 5000

app.use(express.json())

app.get('/', (req, res) => {
  logger.info('GET / hit')
  res.send('Server is running')
})

app.get('/api/ice-servers', (req, res) => {
  res.json({ iceServers: getIceServers() })
})

initSocket(server)

server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`)
})
