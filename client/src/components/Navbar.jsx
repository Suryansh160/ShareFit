import { motion } from 'framer-motion'

export default function Navbar () {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 0.8, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='absolute top-0 left-6 right-6 md:left-12 md:right-12 z-20 rounded-b-3xl border border-slate border-t-0 bg-bg/70 backdrop-blur-md px-8 py-5'
    >
      <span className='font-display text-2xl font-bold tracking-tight'>
        Share<span className='text-signal'>Fit</span>
      </span>
    </motion.nav>
  )
}
