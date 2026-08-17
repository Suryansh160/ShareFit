import { motion } from 'framer-motion'
import { CardContainer, CardBody, CardItem } from '../ui/3d-card.jsx'

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
        <CardContainer containerClassName='py-0 w-full' className='w-full'>
          <CardBody className='group !h-auto w-full rounded-xl border border-slate bg-bg/70 backdrop-blur-md hover:border-signal transition-colors p-8 text-left shadow-2xl'>
            <CardItem
              translateZ={40}
              className='block font-mono text-xs text-signal mb-3'
            >
              status: {connectionState}
              {channelOpen ? ' [connected]' : ''}
            </CardItem>

            {channelOpen && (
              <CardItem translateZ={30} className='block w-full space-y-4'>
                <input
                  type='file'
                  onChange={e => setSelectedFile(e.target.files[0])}
                  className='w-full text-sm text-ink file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-slate file:bg-transparent file:text-ink hover:file:border-signal file:cursor-pointer'
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
              </CardItem>
            )}

            {errorMsg && (
              <CardItem
                translateZ={20}
                className='block text-sm text-ember pt-2'
              >
                {errorMsg}
              </CardItem>
            )}

            <CardItem translateZ={20} className='block w-full pt-4'>
              <button
                onClick={onReset}
                className='w-full py-2 rounded border border-slate text-ink/60 hover:border-ember hover:text-ember transition font-mono text-sm'
              >
                reset
              </button>
            </CardItem>
          </CardBody>
        </CardContainer>
      </motion.div>
    </div>
  )
}
