import { Component, useEffect, useState, type ReactNode } from 'react'
import { Landing } from './landing/Landing'
import { Game } from './game/Game'

// If anything inside the game crashes, show a recovery screen instead of a blank page.
class GameErrorBoundary extends Component<{ children: ReactNode; onExit: () => void }, { error: Error | null; run: number }> {
  state = { error: null as Error | null, run: 0 }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error) { console.error('[DELETE ME] game crashed:', error) }
  render() {
    const { error, run } = this.state
    if (!error) return <div key={run} style={{ display: 'contents' }}>{this.props.children}</div>
    return (
      <div className="crash" role="alert">
        <p className="crash-title">SYSTEM FAILURE</p>
        <p>Something went wrong and the desktop stopped responding.</p>
        <pre className="crash-msg">{String(error.message || error)}</pre>
        <div className="crash-actions">
          <button className="btn" onClick={() => this.setState({ error: null, run: run + 1 })}>Reboot</button>
          <button className="btn is-ghost" onClick={this.props.onExit}>Back to project page</button>
        </div>
      </div>
    )
  }
}

export default function App() {
  const [playing, setPlaying] = useState<null | { skip: boolean }>(() =>
    typeof location !== 'undefined' && location.hash === '#play' ? { skip: false } : null,
  )
  useEffect(() => {
    document.documentElement.classList.toggle('is-playing', !!playing)
    if (!playing) window.scrollTo({ top: 0 })
  }, [playing])
  return playing ? (
    <GameErrorBoundary onExit={() => setPlaying(null)}>
      <Game skipRecovery={playing.skip} onExit={() => setPlaying(null)} />
    </GameErrorBoundary>
  ) : (
    <Landing onPlay={(skip) => setPlaying({ skip })} />
  )
}
