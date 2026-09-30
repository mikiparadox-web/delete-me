import { useState } from 'react'
import { motion } from 'framer-motion'
import { PHOTOS, PHOTO_START, type Photo } from '../story'
import { useGame } from '../store'
import { sfx } from '../audio'

export function Scene({ p, showLetter }: { p: Photo; showLetter: boolean }) {
  return (
    <div className="scene" style={{ background: `linear-gradient(180deg, ${p.sky[0]} 0%, ${p.sky[1]} 55%, ${p.sky[2]} 100%)` }}>
      <span
        className={`scene-sun ${p.sun.moon ? 'is-moon' : ''}`}
        style={{ left: `${p.sun.x}%`, top: `${p.sun.y}%`, background: p.sun.c, boxShadow: `0 0 28px 6px ${p.sun.c}88` }}
      />
      {p.sun.moon && <span className="scene-stars" />}
      <svg className="scene-land" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden>
        <path d="M0 42 L60 38 L90 44 L200 36 L200 60 L0 60Z" fill="#0d0e18" opacity=".85" />
        <rect x="146" y="8" width="8" height="30" fill="#0d0e18" />
        <path d="M144 8h12l-2-5h-8z" fill="#0d0e18" />
        {p.lights && <rect x="147.5" y="4" width="5" height="3" fill="#ffe08a" />}
        <path d="M0 50 Q50 46 100 50 T200 49 L200 60 L0 60Z" fill="#05060c" />
      </svg>
      <span className={`scene-letter ${showLetter ? 'is-shown' : ''}`}>{p.letter}</span>
    </div>
  )
}

export function Photos() {
  const { s, solve, log, say } = useGame()
  const solved = s.fragments.photos
  const [order, setOrder] = useState<number[]>(solved ? [0, 1, 2, 3, 4] : PHOTO_START)
  const [pick, setPick] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)

  const tap = (slot: number) => {
    if (solved) return
    sfx.click()
    if (pick === null) return setPick(slot)
    if (pick === slot) return setPick(null)
    const next = [...order]
    ;[next[pick], next[slot]] = [next[slot], next[pick]]
    setOrder(next)
    setPick(null)
    setMoves((m) => m + 1)
    log(`swapped photos ${pick + 1} and ${slot + 1}`)
    if (next.every((v, i) => v === i)) {
      window.setTimeout(() => {
        solve('photos', 'put the harbor day back in order: L U M E N')
        say('the harbor day. L, U, M, E, N. she named me after that day. did you know that?', 1600)
      }, 400)
    }
  }

  return (
    <div className="app photos">
      <div className="app-toolbar">
        <span className="crumb">Photos / Harbor day — 12 Oct</span>
        <span className="muted">{solved ? 'Timeline restored' : `${moves} swaps`}</span>
      </div>
      <p className="app-note">
        {solved
          ? 'The day is back in order. Each print has a letter pencilled on the back.'
          : 'The drive failure scrambled the timeline and wiped the timestamps. Select two photos to swap them, and rebuild the day from morning to night.'}
      </p>
      <ol className="photo-row">
        {order.map((pi, slot) => {
          const p = PHOTOS[pi]
          return (
            <motion.li key={p.id} layout transition={{ type: 'spring', stiffness: 500, damping: 36 }}>
              <button
                className={`photo ${pick === slot ? 'is-picked' : ''}`}
                onClick={() => tap(slot)}
                aria-label={`Photo ${slot + 1}: ${p.label}${pick === slot ? ' (selected)' : ''}`}
                disabled={solved}
              >
                <Scene p={p} showLetter={solved} />
                <span className="photo-cap">
                  <b>{solved ? p.id : 'IMG_1012_????'}</b>
                  <i>{p.label}</i>
                </span>
              </button>
            </motion.li>
          )
        })}
      </ol>
      {solved && (
        <motion.div className="photo-word" initial={{ opacity: 0, letterSpacing: '1.2em' }} animate={{ opacity: 1, letterSpacing: '0.5em' }} transition={{ duration: 1.2 }}>
          LUMEN
        </motion.div>
      )}
    </div>
  )
}
