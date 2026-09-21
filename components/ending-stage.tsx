'use client'

import { useEffect, useState } from 'react'

export function EndingStage() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300), // "That's all."
      setTimeout(() => setStep(2), 3200), // "Happy birthday, Angel."
      setTimeout(() => setStep(3), 5200), // final flower
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="burgundy-bg relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      {step >= 1 && (
        <p
          className="anim-ink-in font-serif text-2xl font-light italic text-[var(--ink-soft)] sm:text-3xl"
          style={step >= 2 ? { opacity: 0.5, transition: 'opacity 1.5s ease' } : undefined}
        >
          That&apos;s all.
        </p>
      )}

      {step >= 2 && (
        <h2 className="anim-ink-in mt-6 font-serif text-[2.4rem] font-light italic leading-tight text-[var(--paper)] sm:text-[3.4rem]">
          Happy birthday, Angel.
        </h2>
      )}

      {step >= 3 && (
        <img
          src="/flowers/whiterose.png"
          alt="A single white rose"
          className="anim-reveal anim-float mt-12 h-auto w-40 drop-shadow-[0_16px_28px_rgba(80,50,30,0.25)] sm:w-52"
          draggable={false}
        />
      )}
    </div>
  )
}
