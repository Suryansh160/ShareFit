import { Outlet } from 'react-router-dom'
import NetworkBackground from './NetworkBackground.jsx'
import Navbar from './Navbar.jsx'

export default function Layout () {
  return (
    <div className='relative min-h-screen w-full font-body overflow-hidden'>
      <NetworkBackground />
      <Navbar />
      <Outlet />
    </div>
  )
}
