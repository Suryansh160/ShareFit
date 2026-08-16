import { useEffect, useRef, useState } from 'react'

export default function NetworkBackground () {
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null)

  useEffect(() => {
    let effect
    let cancelled = false

    function waitForVanta () {
      if (window.VANTA && window.VANTA.TOPOLOGY) {
        if (cancelled) return

        effect = window.VANTA.TOPOLOGY({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x2222,
          color: 0x89964e
        })

        setVantaEffect(effect)
      } else {
        setTimeout(waitForVanta, 50)
      }
    }

    waitForVanta()

    return () => {
      cancelled = true
      if (effect) effect.destroy()
    }
  }, [])

  return (
    <div
      ref={vantaRef}
      className='absolute inset-0 w-full h-full pointer-events-none'
    />
  )
}
