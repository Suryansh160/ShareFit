import { io } from 'socket.io-client'

const backendUrl = import.meta.env.VITE_BACKEND_URL || undefined

export const socket = io(backendUrl)
