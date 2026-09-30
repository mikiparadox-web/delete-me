import { motion } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { useGame, type Win } from './store'
import { sfx } from './audio'

export function WindowFrame({ win, children, focused }: { win: Win; children: ReactNode; focused: boolean }) {
  const { d } = useGame()
  const drag = useRef<{ dx: number; dy: number } | null>(null)

  const onDown = (e: React.PointerEvent) => {
    if (win.max || (e.target as HTMLElement).closest('button')) return
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const x = Math.max(-win.w + 120, Math.min(window.innerWidth - 120, e.clientX - drag.current.dx))
    const y = Math.max(0, Math.min(window.innerHeight - 90, e.clientY - drag.current.dy))
    d({ type: 'move', id: win.id, x, y })
  }
  const onUp = () => (drag.current = null)

  const style: React.CSSProperties = win.max
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - var(--taskbar-h))', zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }

  return (
    <motion.section
      className={`win ${focused ? 'is-focused' : ''} ${win.max ? 'is-max' : ''}`}
      style={{ ...style, display: win.min ? 'none' : undefined }}
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      onPointerDown={() => !focused && d({ type: 'focus', id: win.id })}
      role="dialog"
      aria-label={win.title}
    >
      <header
        className="win-bar"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onDoubleClick={() => d({ type: 'max', id: win.id })}
      >
        <span className="win-title">{win.title}</span>
        <div className="win-ctrls">
          <button aria-label="Minimize" onClick={() => { sfx.click(); d({ type: 'min', id: win.id }) }}>
            <svg viewBox="0 0 10 10"><rect x="1" y="7" width="8" height="1.6" /></svg>
          </button>
          <button aria-label="Maximize" onClick={() => { sfx.click(); d({ type: 'max', id: win.id }) }}>
            <svg viewBox="0 0 10 10"><rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
          <button aria-label="Close" className="is-close" onClick={() => { sfx.close(); d({ type: 'close', id: win.id }) }}>
            <svg viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        </div>
      </header>
      <div className="win-body">{children}</div>
    </motion.section>
  )
}
