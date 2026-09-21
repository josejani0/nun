'use client'

import { useEffect, useRef, useState } from 'react'

export function FlowerQuestion({
  onSubmit,
  onStartMusic,
}: {
  onSubmit: (count: number) => void
  onStartMusic: () => void
}) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onStartMusic()
  }, [onStartMusic])

  function submit() {
    const n = value === '' ? 0 : Number.parseInt(value, 10)
    onSubmit(Number.isNaN(n) ? 0 : Math.min(99, Math.max(0, n)))
  }

  return (
    <div className="burgundy-bg relative flex h-full w-full items-center justify-center overflow-hidden px-6">
      <div className="anim-fade-up relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <h1 className="font-serif text-[2.1rem] font-light italic leading-tight text-[var(--paper)] sm:text-[2.9rem]">
          Hey , how many flowers
          <br />
          would you like?
        </h1>

        <div className="mt-14 flex flex-col items-center">
          <div className="relative flex items-end justify-center">
            <input
              ref={inputRef}
              inputMode="numeric"
              autoFocus
              aria-label="Number of flowers"
              value={value}
              placeholder="0"
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 2)
                setValue(digits)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  submit()
                }
              }}
              className="w-[3.4ch] bg-transparent text-center font-serif text-[4.5rem] font-light leading-none text-[var(--paper)] outline-none placeholder:text-[var(--parchment-edge)] sm:text-[6rem]"
            />
          </div>
          <div className="ink-rule mt-1 w-52 sm:w-64" />
        </div>

        <button
          type="button"
          onClick={submit}
          className="group mt-12 inline-flex items-center gap-2 font-serif text-xl italic tracking-wide text-[var(--paper)] transition-colors hover:text-[var(--red)]"
        >
          <span className="relative">
            Enter
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-current opacity-40 transition-transform group-hover:scale-x-0" />
          </span>
          <span
            aria-hidden
            className="text-[var(--red)] transition-transform group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </button>
      </div>
    </div>
  )
}