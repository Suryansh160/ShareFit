import { motion } from 'framer-motion'

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
    <div className='relative z-10 w-full max-w-4xl mx-auto px-8 flex flex-col items-start min-h-screen justify-center'>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='max-w-3xl'
      >
        <div className='font-mono text-xs tracking-widest text-signal mb-4 uppercase'>
          Receive
        </div>

        <h1 className='font-display text-5xl md:text-6xl font-bold leading-none tracking-tight mb-6'>
          {roomId ? (
            <>
              Room <span className='!text-[#22d3ee]'>{roomId}</span>
            </>
          ) : (
            'Join a room'
          )}
        </h1>

        <p className='text-ink/70 text-xl max-w-md'>
          {roomId
            ? 'Waiting for the file.'
            : 'Enter the room code you were given.'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className='w-full max-w-xl mt-10'
      >
        <div className='w-full rounded-xl border border-slate bg-bg/70 backdrop-blur-md hover:border-signal transition-colors p-8 text-left shadow-2xl'>
          {!roomId && (
            <div className='w-full space-y-4'>
              <input
                value={roomInput}
                onChange={e => setRoomInput(e.target.value.toUpperCase())}
                placeholder='room_code'
                className='w-full bg-transparent border border-slate rounded px-3 py-2 text-ink font-mono text-sm tracking-widest uppercase placeholder:text-ink/30 focus:outline-none focus:border-signal'
              />

              <button
                onClick={onJoin}
                disabled={!roomInput}
                className='w-full py-2 rounded border border-signal text-signal hover:bg-signal/10 disabled:opacity-30 disabled:cursor-not-allowed transition font-mono text-sm'
              >
                join_room
              </button>
            </div>
          )}

          {roomId && (
            <div className='w-full space-y-4'>
              <div className='font-mono text-xs text-signal'>
                status: {connectionState}
                {channelOpen ? ' [connected]' : ''}
              </div>

              {incomingFile && (
                <div className='font-mono text-sm text-ink/70 space-y-1'>
                  <p className='truncate'>receiving: {incomingFile.name}</p>

                  <p>progress: {receiveProgress}%</p>
                </div>
              )}

              {downloadUrl && (
                <button
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = downloadUrl
                    a.download = incomingFile?.name || 'file'
                    a.click()
                  }}
                  className='w-full py-2 rounded border border-signal text-signal hover:bg-signal/10 transition font-mono text-sm'
                >
                  download_file
                </button>
              )}
            </div>
          )}

          {errorMsg && <p className='text-sm text-ember pt-4'>{errorMsg}</p>}

          <div className='w-full pt-4'>
            <button
              onClick={onReset}
              className='w-full py-2 rounded border border-slate text-ink/60 hover:border-ember hover:text-ember transition font-mono text-sm'
            >
              reset
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
