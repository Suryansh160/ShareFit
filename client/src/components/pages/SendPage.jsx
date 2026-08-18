import { motion } from 'framer-motion'
import { FileUpload } from '../ui/file-upload.jsx'

export default function SendPage ({
  roomId,
  connectionState,
  channelOpen,
  selectedFile,
  setSelectedFile,
  sendProgress,
  errorMsg,
  onSendFile,
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
          Send
        </div>

        <h1 className='font-display text-5xl md:text-6xl font-bold leading-none tracking-tight mb-6'>
          Room <span className='!text-[#22d3ee]'>{roomId}</span>
        </h1>

        <p className='text-ink/70 text-xl max-w-md'>
          Share this code with the receiver.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className='w-full max-w-xl mt-10'
      >
        <div className='w-full rounded-xl border border-slate bg-bg/70 backdrop-blur-md hover:border-signal transition-colors p-8 text-left shadow-2xl'>
          <div className='font-mono text-xs text-signal mb-3'>
            status: {connectionState}
            {channelOpen ? ' [connected]' : ''}
          </div>

          {channelOpen && (
            <div className='w-full space-y-4'>
              <FileUpload
                onChange={files => setSelectedFile(files[0] || null)}
              />
              <button
                onClick={onSendFile}
                disabled={!selectedFile}
                className='w-full py-2 rounded border border-signal text-signal hover:bg-signal/10 disabled:opacity-30 disabled:cursor-not-allowed transition font-mono text-sm'
              >
                send_file
              </button>
              {sendProgress > 0 && (
                <p className='text-sm text-ink/60 font-mono'>
                  sending: {sendProgress}%
                </p>
              )}
            </div>
          )}

          {errorMsg && (
            <p className='text-sm text-ember pt-2'>{errorMsg}</p>
          )}

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