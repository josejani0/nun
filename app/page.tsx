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

  const go = useCallback((next: Stage) => {
    setPrev(null)
    setStage(next)
  }, [])

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

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[var(--burgundy)]">

      {stage === 'surprise' && (
        <div className="stage-layer">
          <SurpriseStage
            onStartMusic={unlockMusic}
            onDone={() => go('jokes')}
          />
        </div>
      )}

      {stage === 'jokes' && (
        <div className="stage-layer">
          <JokesAsideStage
            onStartMusic={startMusic}
            onDone={() => go('question')}
          />
        </div>
      )}

      {stage === 'question' && (
        <div className="stage-layer">
          <FlowerQuestion
            onSubmit={() => go('flowers')}
          />
        </div>
      )}

      {stage === 'flowers' && (
        <div className="stage-layer">
          <FlowerStage
            onDone={() => go('letter')}
          />
        </div>
      )}

      {stage === 'letter' && (
        <div className="stage-layer">
          <LetterStage
            onDone={() => go('ending')}
          />
        </div>
      )}

      {stage === 'ending' && (
        <div className="stage-layer">
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
