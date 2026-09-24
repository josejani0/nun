'use client'

import { useCallback, useRef, useState } from 'react'
import { FlowerQuestion } from '@/components/flower-question'
import { FlowerStage } from '@/components/flower-stage'
import { SurpriseStage } from '@/components/surprise-stage'
import { JokesAsideStage } from '@/components/jokes-aside-stage'
import { LetterStage } from '@/components/letter-stage'
import { EndingStage } from '@/components/ending-stage'
import { MusicToggle } from '@/components/music-toggle'

type Stage = 'question' | 'flowers' | 'surprise' | 'jokes' | 'letter' | 'ending'

export default function Page() {
  const [stage, setStage] = useState<Stage>('surprise')
  const [prev, setPrev] = useState<Stage | null>(null)
  const [musicOn, setMusicOn] = useState(false)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeRef = useRef<number | null>(null)

  const go = useCallback(
    (next: Stage) => {
      setPrev(stage)
      setStage(next)
      window.setTimeout(() => setPrev(null), 1100)
    },
    [stage],
  )

  const unlockMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0
    audio.currentTime = 0

    const p = audio.play()

    if (p) {
      p.catch(() => {})
    }
  }, [])

  const startMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    setMusicOn(true)

    audio.currentTime = 0
    audio.volume = 0

    if (audio.paused) {
      const p = audio.play()

      if (p) {
        p.catch(() => {})
      }
    }

    if (fadeRef.current) {
      window.clearInterval(fadeRef.current)
    }

    const target = 0.55

    fadeRef.current = window.setInterval(() => {
      if (!audioRef.current) return

      const v = audioRef.current.volume

      if (v >= target - 0.02) {
        audioRef.current.volume = target

        if (fadeRef.current) {
          window.clearInterval(fadeRef.current)
        }
      } else {
        audioRef.current.volume = Math.min(target, v + 0.02)
      }
    }, 90)
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    const next = !muted
    setMuted(next)
    audio.muted = next
  }, [muted])

  const show = (name: Stage) => stage === name || prev === name

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[var(--burgundy)]">

      {show('surprise') && (
        <div
          className="stage-layer"
          style={{
            opacity: stage === 'surprise' ? 1 : 0,
            pointerEvents: stage === 'surprise' ? 'auto' : 'none',
          }}
        >
          <SurpriseStage
            onStartMusic={unlockMusic}
            onDone={() => go('jokes')}
          />
        </div>
      )}

      {show('jokes') && (
        <div
          className="stage-layer"
          style={{
            opacity: stage === 'jokes' ? 1 : 0,
            pointerEvents: stage === 'jokes' ? 'auto' : 'none',
          }}
        >
          <JokesAsideStage
            onStartMusic={startMusic}
            onDone={() => go('question')}
          />
        </div>
      )}

      {show('question') && (
        <div
          className="stage-layer"
          style={{
            opacity: stage === 'question' ? 1 : 0,
            pointerEvents: stage === 'question' ? 'auto' : 'none',
          }}
        >
          <FlowerQuestion
            onSubmit={() => go('flowers')}
          />
        </div>
      )}

      {show('flowers') && (
        <div
          className="stage-layer"
          style={{
            opacity: stage === 'flowers' ? 1 : 0,
            pointerEvents: stage === 'flowers' ? 'auto' : 'none',
          }}
        >
          <FlowerStage onDone={() => go('letter')} />
        </div>
      )}

      {show('letter') && (
        <div
          className="stage-layer"
          style={{
            opacity: stage === 'letter' ? 1 : 0,
            pointerEvents: stage === 'letter' ? 'auto' : 'none',
          }}
        >
          <LetterStage onDone={() => go('ending')} />
        </div>
      )}

      {show('ending') && (
        <div
          className="stage-layer"
          style={{
            opacity: stage === 'ending' ? 1 : 0,
            pointerEvents: stage === 'ending' ? 'auto' : 'none',
          }}
        >
          <EndingStage />
        </div>
      )}

      <audio
        ref={audioRef}
        src="/audio/about-you.mp3"
        loop
        preload="auto"
      />

      {musicOn && (
        <MusicToggle
          muted={muted}
          onToggle={toggleMute}
        />
      )}
    </main>
  )
}
