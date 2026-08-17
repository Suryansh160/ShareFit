import { useState } from 'react'
import { joinRoom, sendFile, leaveRoom } from './webrtc/peerConnection.js'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useFileReceiver } from './hooks/useFileReciever.js'
import Layout from './components/Layout.jsx'
import LandingPage from './components/pages/LandingPage.jsx'
import ReceivePage from './components/pages/RecievePage.jsx'
import SendPage from './components/pages/SendPage.jsx'

function generateRoomCode () {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function App () {
  const navigate = useNavigate()

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
    setErrorMsg('')
    navigate('/send')
    await joinRoom(code, callbacks)
  }

  async function handleStartReceive () {
    if (!roomInput) return
    setRoomId(roomInput)
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
    setRoomId('')
    setRoomInput('')
    setConnectionState('idle')
    setChannelOpen(false)
    setSelectedFile(null)
    setSendProgress(0)
    setErrorMsg('')
    navigate('/')
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path='/'
          element={
            <LandingPage
              onSend={handleStartSend}
              onReceive={() => navigate('/receive')}
            />
          }
        />
        <Route
          path='/send'
          element={
            <SendPage
              roomId={roomId}
              connectionState={connectionState}
              channelOpen={channelOpen}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              sendProgress={sendProgress}
              errorMsg={errorMsg}
              onSendFile={handleSendFile}
              onReset={handleReset}
            />
          }
        />
        <Route
          path='/receive'
          element={
            <ReceivePage
              roomId={roomId}
              roomInput={roomInput}
              setRoomInput={setRoomInput}
              onJoin={handleStartReceive}
              connectionState={connectionState}
              channelOpen={channelOpen}
              incomingFile={incomingFile}
              receiveProgress={receiveProgress}
              downloadUrl={downloadUrl}
              errorMsg={errorMsg}
              onReset={handleReset}
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default App
