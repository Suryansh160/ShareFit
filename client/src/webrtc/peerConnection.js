import { socket } from './socket.js'

let peerConnection = null
let dataChannel = null
let currentRoomId = null
let isInitiator = false

async function fetchIceServers () {
  const res = await fetch('/api/ice-servers')
  const data = await res.json()
  return data.iceServers
}

// Wires up a data channel's events - same logic whether we created it
// (initiator) or received it (the other peer).
function setupDataChannel (channel, callbacks) {
  channel.binaryType = 'arraybuffer'

  channel.onopen = () => {
    callbacks.onChannelOpen?.()
  }

  channel.onclose = () => {
    callbacks.onChannelClose?.()
  }

  channel.onmessage = event => {
    callbacks.onData?.(event.data)
  }

  dataChannel = channel
}

async function createPeerConnection (callbacks) {
  const iceServers = await fetchIceServers()
  const pc = new RTCPeerConnection({ iceServers })

  pc.onicecandidate = event => {
    if (event.candidate && currentRoomId) {
      socket.emit('ice-candidate', {
        roomId: currentRoomId,
        candidate: event.candidate
      })
    }
  }

  pc.onconnectionstatechange = () => {
    callbacks.onConnectionStateChange?.(pc.connectionState)
  }

  // The peer that DIDN'T create the data channel receives it here
  pc.ondatachannel = event => {
    setupDataChannel(event.channel, callbacks)
  }

  return pc
}

// Call this to join a transfer room. First peer in waits; second peer to
// join becomes the initiator, creates the data channel + offer.
export async function joinRoom (roomId, callbacks) {
  currentRoomId = roomId
  peerConnection = await createPeerConnection(callbacks)

  socket.emit('join-room', roomId)

  socket.on('room-full', ({ message }) => {
    callbacks.onRoomFull?.(message)
  })

  // We're the second peer - create the data channel and send an offer
  socket.on('user-joined', async () => {
    isInitiator = true

    const channel = peerConnection.createDataChannel('file-transfer')
    setupDataChannel(channel, callbacks)

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    socket.emit('offer', { roomId, offer })
  })

  // We're the first peer - respond to the offer with an answer
  socket.on('offer', async ({ offer }) => {
    await peerConnection.setRemoteDescription(offer)
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    socket.emit('answer', { roomId, answer })
  })

  socket.on('answer', async ({ answer }) => {
    await peerConnection.setRemoteDescription(answer)
  })

  socket.on('ice-candidate', async ({ candidate }) => {
    try {
      await peerConnection.addIceCandidate(candidate)
    } catch (err) {
      console.error('Failed to add ICE candidate', err)
    }
  })

  socket.on('user-left', () => {
    callbacks.onPeerLeft?.()
    cleanupPeerConnection()
  })
}

// Sends a File object over the data channel, chunked to stay under
// WebRTC's per-message size limits.
export async function sendFile (file, onProgress) {
  if (!dataChannel || dataChannel.readyState !== 'open') {
    throw new Error('Data channel is not open')
  }

  const CHUNK_SIZE = 16 * 1024 // 16KB per chunk
  const buffer = await file.arrayBuffer()
  const totalChunks = Math.ceil(buffer.byteLength / CHUNK_SIZE)

  // Send file metadata first so the receiver knows what's coming
  dataChannel.send(
    JSON.stringify({
      type: 'file-meta',
      name: file.name,
      size: file.size,
      mimeType: file.type
    })
  )

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE
    const chunk = buffer.slice(start, start + CHUNK_SIZE)
    dataChannel.send(chunk)
    onProgress?.(Math.round(((i + 1) / totalChunks) * 100))

    // Basic backpressure: pause briefly if the send buffer is filling up
    if (dataChannel.bufferedAmount > CHUNK_SIZE * 8) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }

  dataChannel.send(JSON.stringify({ type: 'file-end' }))
}

export function leaveRoom () {
  if (currentRoomId) {
    socket.emit('leave-room', currentRoomId)
  }
  cleanupPeerConnection()
}

function cleanupPeerConnection () {
  dataChannel?.close()
  peerConnection?.close()
  dataChannel = null
  peerConnection = null
  currentRoomId = null
  isInitiator = false

  socket.off('room-full')
  socket.off('user-joined')
  socket.off('offer')
  socket.off('answer')
  socket.off('ice-candidate')
  socket.off('user-left')
}
