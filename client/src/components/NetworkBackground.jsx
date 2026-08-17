import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'

// Aceternity's Wavy Background, adapted to plain JSX (no TypeScript/shadcn
// tooling needed) and tuned to the signal/ember palette.
export default function NetworkBackground () {
  const canvasRef = useRef(null)

  useEffect(() => {
    const noise = createNoise3D()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w, h, nt
    let animationId

    const waveColors = ['#0FD9C4', '#0FD9C4', '#FF6B3D', '#0FD9C4', '#FF6B3D']
    const blur = 10
    const waveOpacity = 0.5
    const waveWidth = 40
    const speed = 0.0015

    function resize () {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
      ctx.filter = `blur(${blur}px)`
    }

    function drawWave (n) {
      nt += speed
      for (let i = 0; i < n; i++) {
        ctx.beginPath()
        ctx.lineWidth = waveWidth
        ctx.strokeStyle = waveColors[i % waveColors.length]
        for (let x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100
          ctx.lineTo(x, y + h * 0.5)
        }
        ctx.stroke()
        ctx.closePath()
      }
    }

    function render () {
      ctx.fillStyle = '#071A1D'
      ctx.globalAlpha = waveOpacity
      ctx.fillRect(0, 0, w, h)
      drawWave(5)
      animationId = requestAnimationFrame(render)
    }

    nt = 0
    resize()
    render()

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className='absolute inset-0 w-full h-full pointer-events-none'
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  )
}
