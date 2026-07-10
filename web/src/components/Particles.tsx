import { useEffect } from 'react'

/** Client-only particle field — skips when prefers-reduced-motion */
export function Particles() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let canvas = document.getElementById('fx-field') as HTMLCanvasElement | null
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.id = 'fx-field'
      canvas.setAttribute('aria-hidden', 'true')
      document.body.prepend(canvas)
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fine = matchMedia('(pointer: fine)').matches
    const N = fine ? 42 : 24
    const dots: Array<{
      x: number
      y: number
      r: number
      vx: number
      vy: number
      c: string
    }> = []
    let raf = 0

    const resize = () => {
      const dpr = devicePixelRatio || 1
      canvas!.width = innerWidth * dpr
      canvas!.height = innerHeight * dpr
      canvas!.style.width = `${innerWidth}px`
      canvas!.style.height = `${innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots.length = 0
      for (let i = 0; i < N; i++) {
        dots.push({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          r: 0.6 + Math.random() * 1.8,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          c: Math.random() > 0.72 ? 'rgba(232,52,26,0.55)' : 'rgba(255,225,74,0.45)',
        })
      }
    }

    const tick = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      for (const d of dots) {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > innerWidth) d.vx *= -1
        if (d.y < 0 || d.y > innerHeight) d.vy *= -1
        ctx.beginPath()
        ctx.fillStyle = d.c
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i]
          const b = dots[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < 120) {
            ctx.strokeStyle = `rgba(255,225,74,${0.12 * (1 - dist / 120)})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    tick()
    addEventListener('resize', resize, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      canvas?.remove()
    }
  }, [])

  return null
}
