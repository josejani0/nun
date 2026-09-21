'use client'

import { useEffect } from 'react'

export function JokesAsideStage({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 3000)

    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <div className="burgundy-bg relative flex h-full w-full items-center justify-center overflow-hidden">
      <p
        className="anim-jokes-aside font-serif text-[3rem] font-light italic tracking-wide text-[var(--paper)] sm:text-[4.5rem]"
        style={{ textShadow: '0 4px 30px rgba(0,0,0,0.45)' }}
      >
        jokes aside.
      </p>
    </div>
  )
}