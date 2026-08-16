import { motion } from 'framer-motion'
import NetworkBackground from './NetworkBackground.jsx'
import Navbar from './Navbar.jsx'

export default function LandingPage ({ onSend, onReceive }) {
  return (
    <div className='relative min-h-screen w-full flex items-center font-body overflow-hidden'>
      <NetworkBackground />
      <Navbar />

      <div className='relative z-10 w-full max-w-6xl mx-auto px-8 flex items-center justify-between gap-16'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='max-w-xl'
        >
          <p className='font-mono text-xs tracking-widest text-signal mb-4 uppercase'>
            Peer to peer &middot; No cloud &middot; No accounts
          </p>
          <h1 className='font-display text-7xl font-bold leading-none tracking-tight mb-6'>
            Send files, browser to browser.
          </h1>
          <p className='text-ink/70 text-lg max-w-md'>
            Files move directly between two people, nothing touches a server in
            between.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className='flex flex-col gap-4 w-[380px] flex-shrink-0'
        >
          <button
            onClick={onSend}
            className='group w-full rounded-xl border border-slate bg-bg/70 backdrop-blur-md hover:border-signal transition-colors p-8 text-left shadow-2xl'
          >
            <span className='block font-mono text-xs text-signal mb-3'>01</span>
            <span className='block font-display text-2xl font-bold mb-1'>
              Send
            </span>
            <span className='block text-sm text-ink/60'>
              Get a code, share it, pick a file
            </span>
          </button>

          <button
            onClick={onReceive}
            className='group w-full rounded-xl border border-slate bg-bg/70 backdrop-blur-md hover:border-ember transition-colors p-8 text-left shadow-2xl'
          >
            <span className='block font-mono text-xs text-ember mb-3'>02</span>
            <span className='block font-display text-2xl font-bold mb-1'>
              Receive
            </span>
            <span className='block text-sm text-ink/60'>
              Enter the code, wait for the file
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
