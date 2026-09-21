'use client'

import { useEffect, useRef, useState } from 'react'

const FLOWER_SRCS = [
  '/flowers/redrose.png',
  '/flowers/whiterose.png',
  '/flowers/lily.png',
  '/flowers/tulip.png',
  '/flowers/forgetmenot.png',
  '/flowers/babysbreath.png',
]

const MAX_FLOWERS = 650
const SPAWN_INTERVAL = 14
const TRAVEL_MS = 850

type Sprite = {
  img: HTMLImageElement
  x: number
  y: number
  size: number
  rot: number
  rotSpeed: number
  swayPhase: number
  swayAmp: number
  born: number
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function FlowerStage({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showMessage, setShowMessage] = useState(false)
  const [stormStarted, setStormStarted] = useState(false)
  const [fading, setFading] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowMessage(true), 200)
    // Keep the message visible for about 2 seconds before the flowers begin.
    const t2 = setTimeout(() => setStormStarted(true), 4200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    if (!stormStarted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0
    let H = 0

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
    }

    resize()
    window.addEventListener('resize', resize)

    const images: HTMLImageElement[] = FLOWER_SRCS.map((src) => {
      const im = new Image()
      im.src = src
      return im
    })

    const sprites: Sprite[] = []
    let allSpawned = false
    let holdStart = 0
    let nextSpawn = performance.now()
    let spawnIndex = 0

    function spawnOne(now: number, index: number) {
      const ready = images.filter((im) => im.complete && im.naturalWidth > 0)
      if (ready.length === 0) return false

      const img = ready[index % ready.length]

      // A widening Archimedean spiral carries each flower outward from
      // the centre. A little radial jitter makes the final fill feel natural
      // rather than like a perfect geometric line.
      const progress = index / (MAX_FLOWERS - 1)
      const angle = index * 0.39
      const maxRadius = Math.hypot(W / 2, H / 2) * 1.18
      const radius = Math.pow(progress, 0.78) * maxRadius
      const jitter = (Math.random() - 0.5) * (38 + progress * 70)
      const targetX =
        W / 2 + Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * jitter
      const targetY =
        H / 2 + Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * jitter

      sprites.push({
        img,
        x: targetX,
        y: targetY,
        size: 48 + Math.pow(Math.random(), 1.35) * 125,
        rot: (Math.random() - 0.5) * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.00065,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 2 + Math.random() * 7,
        born: now,
      })
      return true
    }

    function frame(now: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(dpr, dpr)

      if (!allSpawned && now >= nextSpawn) {
        if (spawnOne(now, spawnIndex)) {
          spawnIndex += 1
          nextSpawn = now + SPAWN_INTERVAL
        } else {
          nextSpawn = now + 100
        }

        if (spawnIndex >= MAX_FLOWERS) {
           allSpawned = true
           holdStart = now
        }
      }

      for (const s of sprites) {
        const age = now - s.born
        const travel = Math.min(1, Math.max(0, age / TRAVEL_MS))
        const eased = easeOutCubic(travel)
        const x = W / 2 + (s.x - W / 2) * eased
        const y = H / 2 + (s.y - H / 2) * eased
        const pop = travel < 1 ? 0.15 + eased * 0.85 : 1
        const sway = Math.sin(now * 0.001 + s.swayPhase) * s.swayAmp
        const r = s.rot + s.rotSpeed * now

        ctx.save()
        ctx.translate(x + sway, y)
        ctx.rotate(r)
        ctx.scale(pop, pop)

        const half = s.size / 2
        const iw = s.img.naturalWidth || 1
        const ih = s.img.naturalHeight || 1
        const ratio = ih / iw
        ctx.drawImage(s.img, -half, -half * ratio, s.size, s.size * ratio)
        ctx.restore()
      }

      ctx.restore()

      if (allSpawned && !doneRef.current && now - holdStart > 1550) {
        doneRef.current = true
        setFading(true)
        window.setTimeout(onDone, 1400)
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [stormStarted, onDone])

  return (
    <div className="burgundy-bg relative h-full w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 transition-opacity duration-[1400ms]"
        style={{ opacity: fading ? 0 : 1 }}
        aria-hidden
      />

      {showMessage && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-8">
          <p
            className={`max-w-2xl text-center font-serif text-[1.7rem] font-light italic leading-snug text-[var(--paper)] sm:text-[2.4rem] ${
              stormStarted ? 'anim-message-out' : 'anim-ink-in'
            }`}
            style={{
              textShadow: '0 2px 18px rgba(242,236,224,0.9)',
              opacity: fading ? 0 : undefined,
              transition: 'opacity 500ms ease',
            }}
          >
            aww thats it? but you deserve all the flowers in the world
          </p>
        </div>
      )}
    </div>
  )
}
