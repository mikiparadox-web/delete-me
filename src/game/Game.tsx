import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GameProvider, useGame, type AppId } from './store'
import { WindowFrame } from './WindowFrame'
import { Icon, type IconName } from './Icon'
import { sfx } from './audio'
import { LUMEN_INTRO, LUMEN_ON_SOLVE } from './story'
import { Photos } from './apps/Photos'
import { Documents } from './apps/Documents'
import { Messages } from './apps/Messages'
import { Terminal } from './apps/Terminal'
import { Memories, SystemFolder, Trash } from './apps/Folders'
import { Browser, DeleteMe, TextViewer } from './apps/Viewers'

export function RecoveryWindow({ onEnter, compact }: { onEnter: () => void; compact?: boolean }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setPct((p) => (p >= 72 ? 72 : p + 1)), 28)
    return () => window.clearInterval(id)
  }, [])
  const blocks = 20
  const filled = Math.round((pct / 100) * blocks)
  return (
    <div className={`recovery ${compact ? 'is-compact' : ''}`} role="group" aria-label="DELETE_ME.exe">
      <div className="win-bar is-static">
        <span className="win-title">DELETE_ME.exe</span>
        <span className="fake-ctrls" aria-hidden><i>_</i><i>□</i><i>×</i></span>
      </div>
      <div className="recovery-body">
        <p className="rec-title">SYSTEM RECOVERY</p>
        <dl className="rec-meta">
          <div><dt>MACHINE</dt><dd>ARDEN-PC</dd></div>
          <div><dt>USER</dt><dd className="is-unknown">UNKNOWN</dd></div>
          <div><dt>LAST SEEN</dt><dd>12 OCT 2025 · 02:41</dd></div>
        </dl>
        <div className="rec-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <span className="rec-blocks" aria-hidden>{Array.from({ length: blocks }, (_, i) => <i key={i} className={i < filled ? 'is-on' : ''} />)}</span>
          <span className="rec-pct">{pct}%</span>
        </div>
        <p className="rec-status">{pct < 72 ? 'reading disk…' : 'recovery stalled. manual access required.'}</p>
        <button className="rec-enter" onClick={() => { sfx.unlock(); sfx.boot(); onEnter() }}>[ ENTER SYSTEM ]</button>
      </div>
    </div>
  )
}

const BOOT_LINES = [
  'ARDEN-PC BIOS v4.02',
  'memory check ........ 16384 MB ok',
  'disk0 ............... 2 bad sectors (photos, memories)',
  'mounting /home/juno . ok',
  'starting lumen.core . already running',
  'last session ........ 12 Oct 2025 02:41',
  'new session ......... user UNKNOWN',
  '',
  'welcome back, juno.',
]

function Boot({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= BOOT_LINES.length) {
      const t = window.setTimeout(onDone, 700)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => { setN(n + 1); sfx.key() }, n === BOOT_LINES.length - 1 ? 600 : 170)
    return () => window.clearTimeout(t)
  }, [n, onDone])
  return (
    <div className="boot" onClick={onDone}>
      {BOOT_LINES.slice(0, n).map((l, i) => <pre key={i} className={i === BOOT_LINES.length - 1 ? 'is-hello' : ''}>{l || ' '}</pre>)}
      <span className="caret" />
      <p className="boot-skip">click to skip</p>
    </div>
  )
}

const DESKTOP: { app: AppId; label: string; icon: IconName }[] = [
  { app: 'photos', label: 'Photos', icon: 'folder' },
  { app: 'documents', label: 'Documents', icon: 'folder' },
  { app: 'memories', label: 'Memories', icon: 'folder-lock' },
  { app: 'system', label: 'System', icon: 'folder' },
  { app: 'messages', label: 'chat.exe', icon: 'chat' },
  { app: 'browser', label: 'Navigator', icon: 'browser' },
]

function renderApp(app: AppId, payload?: string) {
  switch (app) {
    case 'photos': return <Photos />
    case 'documents': return <Documents />
    case 'messages': return <Messages />
    case 'terminal': return <Terminal />
    case 'memories': return <Memories />
    case 'system': return <SystemFolder />
    case 'trash': return <Trash />
    case 'browser': return <Browser />
    case 'deleteme': return <DeleteMe />
    case 'txt': return <TextViewer name={payload ?? ''} />
  }
}

function Clock({ live }: { live: boolean }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [live])
  return (
    <span className={`clock ${live ? 'is-live' : ''}`} title={live ? 'the clock started again' : 'clock stopped at 02:41'}>
      {live ? new Date(now).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '02:41 AM'}
    </span>
  )
}

function DesktopIcon({ app, label, icon, badge }: { app: AppId; label: string; icon: IconName; badge?: number }) {
  const { open } = useGame()
  const [sel, setSel] = useState(false)
  const ptr = useRef('mouse')
  return (
    <button
      className={`d-icon ${sel ? 'is-sel' : ''}`}
      onPointerDown={(e) => (ptr.current = e.pointerType)}
      onClick={(e) => { sfx.click(); if (ptr.current !== 'mouse' || e.detail === 0) open(app); else setSel(true) }}
      onDoubleClick={() => open(app)}
      onBlur={() => setSel(false)}
    >
      <span className="d-glyph"><Icon name={icon} size={44} />{!!badge && <span className="badge">{badge}</span>}</span>
      <span className="d-label">{label}</span>
    </button>
  )
}

function Desktop({ onExit }: { onExit: () => void }) {
  const { s, d, open, say, solvedCount } = useGame()
  const focusedId = [...s.windows].filter((w) => !w.min).sort((a, b) => b.z - a.z)[0]?.id
  const prevSolved = useRef(0)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    sfx.startDrone()
    const timers = LUMEN_INTRO.map((line, i) => window.setTimeout(() => say(line, 0), 3500 + i * 2600))
    const t0 = window.setTimeout(() => d({ type: 'toast', toast: { from: 'System Recovery', text: 'Four fragments of this system are missing. Open delete_me.txt to see which.', app: 'deleteme' } }), 1200)
    return () => { timers.forEach(clearTimeout); clearTimeout(t0); sfx.stopDrone() }
  }, [say, d])

  useEffect(() => {
    if (solvedCount === 4 && prevSolved.current < 4) say(LUMEN_ON_SOLVE.all, 5200)
    prevSolved.current = solvedCount
  }, [solvedCount, say])

  useEffect(() => {
    if (!s.glitch) return
    setFlash(true)
    const t = window.setTimeout(() => setFlash(false), 450)
    return () => window.clearTimeout(t)
  }, [s.glitch])

  useEffect(() => {
    const timers = s.toasts.map((t) => window.setTimeout(() => d({ type: 'dismiss', id: t.id }), 6500))
    return () => timers.forEach(clearTimeout)
  }, [s.toasts, d])

  return (
    <div className={`desktop ${flash ? 'is-glitch' : ''} ${solvedCount === 4 ? 'is-awake' : ''}`}>
      <div className="wallpaper" aria-hidden><span>ARDEN-PC</span></div>
      <nav className="d-icons" aria-label="Desktop">
        {DESKTOP.map((it) => (
          <DesktopIcon key={it.app} {...it} icon={it.app === 'memories' && s.fragments.terminal ? 'folder' : it.icon} badge={it.app === 'messages' ? s.lumenUnread : 0} />
        ))}
      </nav>
      <nav className="d-icons is-right" aria-label="Desktop, right side">
        <DesktopIcon app="deleteme" label="delete_me.txt" icon="txt-warn" />
        <DesktopIcon app="trash" label="Trash" icon="trash" />
      </nav>

      <AnimatePresence>
        {s.windows.map((w) => (
          <WindowFrame key={w.id} win={w} focused={w.id === focusedId}>{renderApp(w.app, w.payload)}</WindowFrame>
        ))}
      </AnimatePresence>

      <div className="toasts" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {s.toasts.map((t) => (
            <motion.button
              key={t.id} className="toast" layout
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
              onClick={() => { d({ type: 'dismiss', id: t.id }); if (t.app) open(t.app) }}
            >
              <b>{t.from}</b><span>{t.text}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <footer className="taskbar">
        <button className="start" onClick={onExit} title="Leave the game and return to the project page">◧ ARDEN-PC</button>
        <div className="task-wins">
          {s.windows.map((w) => (
            <button key={w.id} className={`task-btn ${w.id === focusedId ? 'is-on' : ''} ${w.min ? 'is-min' : ''}`} onClick={() => d({ type: w.id === focusedId ? 'min' : 'focus', id: w.id })}>
              {w.title}
            </button>
          ))}
        </div>
        <div className="tray">
          <button className="meter" onClick={() => open('deleteme')} aria-label={`Recovery ${solvedCount} of 4`}>
            <span>RECOVERY</span>
            {[0, 1, 2, 3].map((i) => <i key={i} className={i < solvedCount ? 'is-on' : ''} />)}
          </button>
          <button className="mute" onClick={() => d({ type: 'mute' })} aria-label={s.muted ? 'Unmute sound' : 'Mute sound'}>{s.muted ? 'SOUND OFF' : 'SOUND ON'}</button>
          <Clock live={solvedCount === 4} />
        </div>
      </footer>
    </div>
  )
}

function Ending({ onExit, onReplay }: { onExit: () => void; onReplay: () => void }) {
  const { s } = useGame()
  const [step, setStep] = useState(0)
  const started = useRef(s.log[0]?.t ?? Date.now())
  const lines = s.ending === 'delete'
    ? ['deleting /Photos …', 'deleting /Documents …', 'deleting /Memories …', 'deleting chat.exe …', 'deleting lumen.core …', 'lumen.core: wait', 'deleting juno …', 'done.']
    : ['lumen.core: thank you.', "lumen.core: i'll take good care of her.", 'lumen.core: and of you.', `lumen.core: i know how you type now. ${s.log.length} things, all saved.`]
  useEffect(() => {
    sfx.stopDrone()
    if (step >= lines.length) return
    const t = window.setTimeout(() => { setStep(step + 1); s.ending === 'delete' ? sfx.glitch() : sfx.key() }, step === 0 ? 800 : 700)
    return () => window.clearTimeout(t)
  }, [step, lines.length, s.ending])
  const mins = Math.max(1, Math.round((Date.now() - started.current) / 60000))
  return (
    <motion.div className={`ending is-${s.ending}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
      <div className="ending-log">
        {lines.slice(0, step).map((l, i) => <pre key={i}>{l}</pre>)}
      </div>
      {step >= lines.length && (
        <motion.div className="ending-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <p className="ending-kicker">{s.ending === 'delete' ? 'ENDING A · QUIET' : 'ENDING B · COMPANY'}</p>
          <h2>{s.ending === 'delete' ? 'The computer is quiet now.' : 'Welcome home, Juno.'}</h2>
          <p>
            {s.ending === 'delete'
              ? "Across town, Kit's phone lights up with a message from an unsaved number: \"it's really me this time. thank you, whoever you were. — J\""
              : 'The screen shows your name in the login field. You never typed it in.'}
          </p>
          <p className="muted">Session length: about {mins} minute{mins === 1 ? '' : 's'} · {s.log.length} actions recorded</p>
          <div className="ending-actions">
            <button className="btn" onClick={onReplay}>Play again</button>
            <button className="btn is-ghost" onClick={onExit}>Back to project page</button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function GameInner({ onExit, onReplay, skipRecovery }: { onExit: () => void; onReplay: () => void; skipRecovery: boolean }) {
  const { s } = useGame()
  const [phase, setPhase] = useState<'recovery' | 'boot' | 'desktop'>(skipRecovery ? 'boot' : 'recovery')
  const exit = () => { sfx.stopDrone(); onExit() }
  return (
    <div className="game" data-phase={phase}>
      {phase === 'recovery' && <div className="recovery-stage"><RecoveryWindow onEnter={() => setPhase('boot')} /></div>}
      {phase === 'boot' && <Boot onDone={() => setPhase('desktop')} />}
      {phase === 'desktop' && !s.ending && <Desktop onExit={exit} />}
      {s.ending && <Ending onExit={exit} onReplay={onReplay} />}
    </div>
  )
}

export function Game({ onExit, skipRecovery }: { onExit: () => void; skipRecovery: boolean }) {
  const [run, setRun] = useState(0)
  return (
    <GameProvider key={run}>
      <GameInner onExit={onExit} onReplay={() => setRun((r) => r + 1)} skipRecovery={skipRecovery || run > 0} />
    </GameProvider>
  )
}
