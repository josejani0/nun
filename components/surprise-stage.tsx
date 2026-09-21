'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Poop = {
  id: number
  size: number
  rot: number
  delay: number
  dx: number
  dy: number
}

export function SurpriseStage({
  onJokesAside,
  onDone,
}: {
  onJokesAside: () => void
  onDone: () => void
}) {
  const [clicked, setClicked] = useState(false)
  const [poops, setPoops] = useState<Poop[]>([])
  const [showHehe, setShowHehe] = useState(false)
  const idRef = useRef(0)

  const handleClick = useCallback(() => {
    if (clicked) return
    setClicked(true)

    const count = 100
    const batch: Poop[] = []

    for (let i = 0; i < count; i++) {
      idRef.current += 1

      const angle =
        -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9
      const distance = 300 + Math.random() * 300

      batch.push({
        id: idRef.current,
        size: 24 + Math.random() * 30,
        rot: (Math.random() - 0.5) * 140,
        delay: Math.random() * 900,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
      })
    }

    setPoops(batch)
    setShowHehe(true)

    // Let the gag play quickly, then move into the serious part.
    window.setTimeout(() => setPoops([]), 2500)
    window.setTimeout(() => {
      onJokesAside()
    }, 1950)
    window.setTimeout(() => {
      onDone()
    }, 4400)
  }, [clicked, onJokesAside, onDone])

  return (
    <div className="burgundy-bg relative flex h-full w-full items-center justify-center overflow-hidden px-6 text-[var(--paper)]">
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.55)]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="mb-5 font-serif text-[2.2rem] font-light italic tracking-wide text-[var(--paper)] sm:text-[3rem]">
          I have a surprise
        </p>

        <button
          type="button"
          onClick={handleClick}
          aria-label="Click the SpongeBob image for the surprise"
          className="relative block cursor-pointer select-none outline-none"
        >
          <img
            src="/character/man.png"
            alt="SpongeBob bent over"
            className={`h-auto w-[260px] drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)] transition-transform duration-150 sm:w-[330px] ${
              clicked ? 'scale-[1.025]' : 'anim-float'
            }`}
            draggable={false}
          />

          {/* Poops start at SpongeBob's butt, then shoot outward quickly. */}
          {poops.map((p) => (
            <PoopParticle key={p.id} poop={p} />
          ))}

          {showHehe && (
            <>
              <span
                className="anim-hehe pointer-events-none absolute -right-5 top-8 font-hand text-4xl font-bold text-[var(--pink)] sm:-right-12 sm:text-5xl"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}
              >
                hehe
              </span>

              <span
                className="anim-hehe pointer-events-none absolute -left-8 top-20 font-hand text-3xl font-bold text-[var(--paper)] sm:-left-16 sm:text-4xl"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                  animationDelay: '180ms',
                }}
              >
                hehe
              </span>

              <span
                className="anim-hehe pointer-events-none absolute right-0 bottom-16 font-hand text-3xl font-bold text-[var(--pink)] sm:-right-4 sm:text-4xl"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                  animationDelay: '360ms',
                }}
              >
                hehe
              </span>
            </>
          )}
        </button>

        <p className="mt-6 font-hand text-xl text-[var(--paper)]/85 sm:text-2xl">
          click on the butt to reveal
        </p>
      </div>
    </div>
  )
}

function PoopParticle({ poop }: { poop: Poop }) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Each poop starts at the butt and gets its own direction and distance.
    const { dx, dy } = poop
    const finalX = dx * 1.15
    const finalY = dy * 1.15 + 100

    const anim = el.animate(
      [
        {
          transform: 'translate(-50%, -50%) rotate(0deg) scale(0.25)',
          opacity: 0,
          offset: 0,
        },
        {
          transform: `translate(calc(-50% + ${dx * 0.35}px), calc(-50% + ${dy * 0.35}px)) rotate(${poop.rot * 0.4}deg) scale(1)`,
          opacity: 1,
          offset: 0.18,
        },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${poop.rot}deg) scale(0.95)`,
          opacity: 1,
          offset: 0.65,
        },
        {
          transform: `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px)) rotate(${poop.rot * 1.4}deg) scale(0.65)`,
          opacity: 0,
          offset: 1,
        },
      ],
      {
        delay: poop.delay,
        duration: 900 + Math.random() * 500,
        easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
        fill: 'forwards',
      },
    )

    return () => anim.cancel()
  }, [poop])

  return (
    <img
      ref={ref}
      src="/character/poop.png"
      alt=""
      aria-hidden
      draggable={false}
      className="pointer-events-none absolute left-[75%] top-[32%] z-30"
      style={{
        width: poop.size,
        height: 'auto',
      }}
    />
  )
}