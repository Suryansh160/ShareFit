export default function ReceivePage ({
  roomId,
  roomInput,
  setRoomInput,
  onJoin,
  connectionState,
  channelOpen,
  incomingFile,
  receiveProgress,
  downloadUrl,
  errorMsg,
  onReset
}) {
  return (
    <div>
      {!roomId && (
        <div>
          <p>Enter the room code you were given.</p>
          <input
            value={roomInput}
            onChange={e => setRoomInput(e.target.value.toUpperCase())}
            placeholder='Enter room code'
          />
          <button onClick={onJoin}>Join</button>
        </div>
      )}

      {roomId && (
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

      <button onClick={onReset}>Reset</button>
    </div>
  )
}
