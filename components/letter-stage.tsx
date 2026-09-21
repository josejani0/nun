'use client'

import { useEffect, useRef, useState } from 'react'

const LETTER: string[] = [
  'Hey Angel,',
  'You are the most beautiful insecure person I know.',
  "I know you for only few months but I don't know why you want to change so many things in you but I find you perfect the way you are.",
  'Please stop worrying about your nose they are perfect so are your ears damn.',
  "I dont need to talk about your eyes right.. And you have the perfect skin color too like damn.",
  'You have a charm and something in you that makes me happy.',
  'You deserve all the good things happens to you.',
  'Hope you achieve everything you want.',
  'I wish you will get to see the world like you want.',
]

export function LetterStage({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(0)
  const [opened, setOpened] = useState(false)
  const [endingStep, setEndingStep] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const endingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setOpened(true), 900)

    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!opened) return

    if (visible >= LETTER.length) {
      // Letter is completely finished.
      // Now reveal the ending section and scroll to it.
      const scrollTimer = setTimeout(() => {
        endingRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 500)

      const timers = [
        scrollTimer,
        setTimeout(() => setEndingStep(1), 1800),
        setTimeout(() => setEndingStep(2), 4700),
        setTimeout(() => setEndingStep(3), 6700),
      ]

      return () => timers.forEach(clearTimeout)
    }

    const current = LETTER[visible]
    const words = current.split(/\s+/).length
    const delay = visible === 0 ? 900 : Math.min(3600, 850 + words * 210)

    const t = setTimeout(() => {
      setVisible((v) => v + 1)
    }, delay)

    return () => clearTimeout(t)
  }, [opened, visible])

  return (
    <div className="burgundy-bg relative h-full w-full overflow-hidden px-4 sm:px-6">
      <div
        ref={scrollRef}
        className="no-scrollbar h-full w-full overflow-y-auto"
      >
        <div className="mx-auto w-full max-w-[640px] py-10">
          {/* LETTER */}
          <div className="relative w-full">
            <div className="parchment-roller mx-auto h-4 w-[102%] rounded-full" />

            <div
              className={opened ? 'anim-unroll' : ''}
              style={!opened ? { maxHeight: 0, overflow: 'hidden' } : undefined}
            >
              <div className="parchment relative rounded-[2px] px-8 py-12 sm:px-14 sm:py-16">
                <div className="space-y-5">
                  {LETTER.slice(0, visible).map((line, i) => (
                    <p
                      key={i}
                      className="anim-reveal font-hand leading-relaxed text-[var(--parchment-ink)]"
                      style={{
                        fontSize: i === 0 ? '2.15rem' : '1.45rem',
                        fontWeight: i === 0 ? 600 : 400,
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="parchment-roller mx-auto h-4 w-[102%] rounded-full" />
          </div>

          {/* ENDING — exists only after the letter finishes */}
          {visible >= LETTER.length && (
            <div
              ref={endingRef}
              className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-24 text-center"
            >
              {endingStep >= 1 && (
                <p
                  className="anim-ink-in font-serif text-2xl font-light italic text-[var(--ink-soft)] sm:text-3xl"
                  style={
                    endingStep >= 2
                      ? {
                          opacity: 0.5,
                          transition: 'opacity 1.5s ease',
                        }
                      : undefined
                  }
                >
                  That&apos;s all.
                </p>
              )}

              {endingStep >= 2 && (
                <h2 className="anim-ink-in mt-6 font-serif text-[2.4rem] font-light italic leading-tight text-[var(--paper)] sm:text-[3.4rem]">
                  Happy birthday, Angel.
                </h2>
              )}

              {endingStep >= 3 && (
                <img
                  src="/flowers/whiterose.png"
                  alt="A single white rose"
                  className="anim-reveal anim-float mt-12 h-auto w-40 drop-shadow-[0_16px_28px_rgba(80,50,30,0.25)] sm:w-52"
                  draggable={false}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}