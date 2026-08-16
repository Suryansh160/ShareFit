import { useState } from 'react'
import { joinRoom, sendFile, leaveRoom } from './webrtc/peerConnection.js'
import { useFileReceiver } from './hooks/useFileReciever.js'
import LandingPage from './components/LandingPage.jsx'

// Generates a short, shareable room code
function generateRoomCode () {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function App () {
  const [mode, setMode] = useState(null) // 'send' | 'receive-input' | 'receive' | null
  const [roomId, setRoomId] = useState('')
  const [roomInput, setRoomInput] = useState('')
  const [connectionState, setConnectionState] = useState('idle')
  const [channelOpen, setChannelOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [sendProgress, setSendProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  const {
    incomingFile,
    progress: receiveProgress,
    downloadUrl,
    handleData
  } = useFileReceiver()

  const callbacks = {
    onData: handleData,
    onChannelOpen: () => setChannelOpen(true),
    onChannelClose: () => setChannelOpen(false),
    onConnectionStateChange: state => setConnectionState(state),
    onRoomFull: message => setErrorMsg(message),
    onPeerLeft: () => {
      setChannelOpen(false)
      setConnectionState('peer left')
    }
  }

  async function handleStartSend () {
    const code = generateRoomCode()
    setRoomId(code)
    setMode('send')
    setErrorMsg('')
    await joinRoom(code, callbacks)
  }

  async function handleStartReceive () {
    if (!roomInput) return
    setRoomId(roomInput)
    setMode('receive')
    setErrorMsg('')
    await joinRoom(roomInput, callbacks)
  }

  async function handleSendFile () {
    if (!selectedFile) return
    setSendProgress(0)
    await sendFile(selectedFile, setSendProgress)
  }

  function handleReset () {
    leaveRoom()
    setMode(null)
    setRoomId('')
    setRoomInput('')
    setConnectionState('idle')
    setChannelOpen(false)
    setSelectedFile(null)
    setSendProgress(0)
    setErrorMsg('')
  }

  return (
    <>
      {!mode && (
        <LandingPage
          onSend={handleStartSend}
          onReceive={() => setMode('receive-input')}
        />
      )}

      {mode && mode !== null && (
        <div
          style={{
            padding: '2rem',
            fontFamily: 'system-ui',
            maxWidth: 480,
            margin: '0 auto'
          }}
        >
          {mode === 'receive-input' && (
            <div>
              <input
                value={roomInput}
                onChange={e => setRoomInput(e.target.value.toUpperCase())}
                placeholder='Enter room code'
              />
              <button onClick={handleStartReceive}>Join</button>
            </div>
          )}

          {mode === 'send' && (
            <div>
              <p>
                Room code: <strong>{roomId}</strong>
              </p>
              <p>Share this with the receiver.</p>
              <p>
                Status: {connectionState} {channelOpen ? '(connected)' : ''}
              </p>

              {channelOpen && (
                <div>
                  <input
                    type='file'
                    onChange={e => setSelectedFile(e.target.files[0])}
                  />
                  <button onClick={handleSendFile} disabled={!selectedFile}>
                    Send File
                  </button>
                  {sendProgress > 0 && <p>Sending: {sendProgress}%</p>}
                </div>
              )}
            </div>
          )}

          {mode === 'receive' && (
            <div>
              <p>
                Room code: <strong>{roomId}</strong>
              </p>
              <p>
                Status: {connectionState} {channelOpen ? '(connected)' : ''}
              </p>

              {incomingFile && (
                <div>
                  <p>Receiving: {incomingFile.name}</p>
                  <p>Progress: {receiveProgress}%</p>
                </div>
              )}

              {downloadUrl && (
                <a href={downloadUrl} download={incomingFile?.name}>
                  Download {incomingFile?.name}
                </a>
              )}
            </div>
          )}

          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

          <button onClick={handleReset}>Reset</button>
        </div>
      )}
    </>
  )
}

export default App
