import { motion } from 'framer-motion'
import { TypewriterEffectSmooth } from '../ui/typewriter-effect.jsx'
import { CardContainer, CardBody, CardItem } from '../ui/3d-card.jsx'
import { FlipWords } from '../ui/flip-words.jsx'

const headlineWords = [
  { text: 'Your\u00A0' },
  { text: 'files.\u00A0' },
  { text: 'Directly\u00A0' },
  { text: 'to\u00A0' },
  { text: 'them.', className: '!text-[#22d3ee]' }
]

export default function LandingPage ({ onSend, onReceive }) {
  return (
    <div className='relative z-10 w-full max-w-4xl mx-auto px-8 flex flex-col items-start min-h-screen justify-center'>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='max-w-3xl'
      >
        <div className='font-mono text-xs tracking-widest text-signal mb-4 uppercase'>
          <FlipWords
            words={['Peer to peer', 'No server', 'No signup', 'No cloud']}
            className='text-signal'
          />
        </div>

        <div className='mb-6'>
          <TypewriterEffectSmooth
            words={headlineWords}
            className='font-display text-6xl md:text-7xl font-bold leading-none tracking-tight'
            cursorClassName='bg-signal'
          />
        </div>

        <p className='text-ink/70 text-xl max-w-md'>
          Files move directly between two people, nothing touches a server in
          between.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className='grid grid-cols-2 gap-4 w-full max-w-xl mt-10'
      >
        <div
          onClick={onSend}
          role='button'
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') onSend()
          }}
          className='cursor-pointer'
        >
          <CardContainer containerClassName='py-0 w-full' className='w-full'>
            <CardBody className='group !h-auto w-full rounded-xl border border-slate bg-bg/70 backdrop-blur-md hover:border-signal transition-colors p-8 text-left shadow-2xl'>
              <CardItem
                translateZ={40}
                className='block font-mono text-xs text-signal mb-3'
              >
                01
              </CardItem>
              <CardItem
                translateZ={60}
                className='block font-display text-2xl font-bold mb-1'
              >
                Send
              </CardItem>
              <CardItem translateZ={30} className='block text-sm text-ink/60'>
                Get a code, share it, pick a file
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        <div
          onClick={onReceive}
          role='button'
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') onReceive()
          }}
          className='cursor-pointer'
        >
          <CardContainer containerClassName='py-0 w-full' className='w-full'>
            <CardBody className='group !h-auto w-full rounded-xl border border-slate bg-bg/70 backdrop-blur-md hover:border-ember transition-colors p-8 text-left shadow-2xl'>
              <CardItem
                translateZ={40}
                className='block font-mono text-xs text-ember mb-3'
              >
                02
              </CardItem>
              <CardItem
                translateZ={60}
                className='block font-display text-2xl font-bold mb-1'
              >
                Receive
              </CardItem>
              <CardItem translateZ={30} className='block text-sm text-ink/60'>
                Enter the code, wait for the file
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </motion.div>
    </div>
  )
}
