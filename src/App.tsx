import { useEffect, useState } from 'react'
import { Landing } from './landing/Landing'
import { Game } from './game/Game'

export default function App() {
  const [playing, setPlaying] = useState<null | { skip: boolean }>(() =>
    typeof location !== 'undefined' && location.hash === '#play' ? { skip: false } : null,
  )
  useEffect(() => {
    document.documentElement.classList.toggle('is-playing', !!playing)
    if (!playing) window.scrollTo({ top: 0 })
  }, [playing])
  return playing ? (
    <Game skipRecovery={playing.skip} onExit={() => setPlaying(null)} />
  ) : (
    <Landing onPlay={(skip) => setPlaying({ skip })} />
  )
}
