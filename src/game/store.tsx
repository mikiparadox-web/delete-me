import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { sfx } from './audio'

export type Fragment = 'photos' | 'journal' | 'terminal' | 'trash'
export const FRAGMENTS: Fragment[] = ['photos', 'journal', 'terminal', 'trash']

export type AppId =
  | 'photos' | 'documents' | 'memories' | 'system' | 'messages' | 'trash'
  | 'terminal' | 'browser' | 'deleteme' | 'txt'

export interface Win {
  id: string
  app: AppId
  title: string
  x: number
  y: number
  w: number
  h: number
  z: number
  min: boolean
  max: boolean
  payload?: string
}

export interface ChatLine { from: 'lumen' | 'you'; text: string; t: number }
export interface Toast { id: number; from: string; text: string; app?: AppId }
export interface LogLine { t: number; text: string }

export interface GameState {
  fragments: Record<Fragment, boolean>
  windows: Win[]
  topZ: number
  toasts: Toast[]
  log: LogLine[]
  lumen: ChatLine[]
  lumenUnread: number
  ending: null | 'delete' | 'keep'
  muted: boolean
  glitch: number
}

type Action =
  | { type: 'open'; app: AppId; title: string; w: number; h: number; payload?: string }
  | { type: 'close'; id: string }
  | { type: 'focus'; id: string }
  | { type: 'min'; id: string }
  | { type: 'max'; id: string }
  | { type: 'move'; id: string; x: number; y: number }
  | { type: 'solve'; f: Fragment }
  | { type: 'toast'; toast: Omit<Toast, 'id'> }
  | { type: 'dismiss'; id: number }
  | { type: 'log'; text: string }
  | { type: 'lumen'; line: ChatLine }
  | { type: 'readLumen' }
  | { type: 'ending'; e: 'delete' | 'keep' }
  | { type: 'mute' }
  | { type: 'glitch' }

let toastId = 1
let winSeq = 1

const initial: GameState = {
  fragments: { photos: false, journal: false, terminal: false, trash: false },
  windows: [],
  topZ: 10,
  toasts: [],
  log: [],
  lumen: [],
  lumenUnread: 0,
  ending: null,
  muted: false,
  glitch: 0,
}

function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'open': {
      const key = a.app + (a.payload ?? '')
      const existing = s.windows.find((w) => w.app + (w.payload ?? '') === key)
      if (existing) {
        return {
          ...s,
          topZ: s.topZ + 1,
          windows: s.windows.map((w) => (w.id === existing.id ? { ...w, min: false, z: s.topZ + 1 } : w)),
        }
      }
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800
      const n = s.windows.length
      const w = Math.min(a.w, vw - 24)
      const h = Math.min(a.h, vh - 80)
      const x = Math.max(8, Math.min(vw - w - 8, 120 + n * 34 + (vw - 1100) / 4))
      const y = Math.max(8, Math.min(vh - h - 60, 40 + n * 28))
      const win: Win = {
        id: 'w' + winSeq++, app: a.app, title: a.title, x, y, w, h,
        z: s.topZ + 1, min: false, max: vw < 720, payload: a.payload,
      }
      return { ...s, topZ: s.topZ + 1, windows: [...s.windows, win], lumenUnread: a.app === 'messages' ? 0 : s.lumenUnread }
    }
    case 'close':
      return { ...s, windows: s.windows.filter((w) => w.id !== a.id) }
    case 'focus':
      return {
        ...s, topZ: s.topZ + 1,
        windows: s.windows.map((w) => (w.id === a.id ? { ...w, z: s.topZ + 1, min: false } : w)),
      }
    case 'min':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, min: true } : w)) }
    case 'max':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, max: !w.max } : w)) }
    case 'move':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, x: a.x, y: a.y } : w)) }
    case 'solve':
      if (s.fragments[a.f]) return s
      return { ...s, fragments: { ...s.fragments, [a.f]: true } }
    case 'toast':
      return { ...s, toasts: [...s.toasts.slice(-1), { ...a.toast, id: toastId++ }] }
    case 'dismiss':
      return { ...s, toasts: s.toasts.filter((t) => t.id !== a.id) }
    case 'log':
      return { ...s, log: [...s.log, { t: Date.now(), text: a.text }] }
    case 'lumen': {
      const chatOpen = s.windows.some((w) => w.app === 'messages' && !w.min)
      return {
        ...s,
        lumen: [...s.lumen, a.line],
        lumenUnread: a.line.from === 'lumen' && !chatOpen ? s.lumenUnread + 1 : s.lumenUnread,
      }
    }
    case 'readLumen':
      return { ...s, lumenUnread: 0 }
    case 'ending':
      return { ...s, ending: a.e }
    case 'mute':
      return { ...s, muted: !s.muted }
    case 'glitch':
      return { ...s, glitch: s.glitch + 1 }
  }
}

interface Ctx {
  s: GameState
  d: React.Dispatch<Action>
  open: (app: AppId, payload?: string) => void
  solve: (f: Fragment, note: string) => void
  log: (text: string) => void
  say: (text: string, delay?: number) => void
  solvedCount: number
}

const GameCtx = createContext<Ctx | null>(null)

export const APP_META: Record<AppId, { title: string; w: number; h: number }> = {
  photos: { title: 'Photos', w: 720, h: 520 },
  documents: { title: 'Documents', w: 620, h: 440 },
  memories: { title: 'Memories', w: 600, h: 440 },
  system: { title: 'System', w: 520, h: 360 },
  messages: { title: 'chat.exe', w: 720, h: 540 },
  trash: { title: 'Trash', w: 640, h: 420 },
  terminal: { title: 'terminal', w: 660, h: 420 },
  browser: { title: 'Navigator', w: 780, h: 540 },
  deleteme: { title: 'delete_me.txt', w: 600, h: 560 },
  txt: { title: 'file', w: 520, h: 420 },
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, initial)
  useEffect(() => sfx.setMuted(s.muted), [s.muted])

  const sRef = useRef(s)
  sRef.current = s

  const fns = useMemo(() => {
    const log = (text: string) => d({ type: 'log', text })
    const say = (text: string, delay = 900) => {
      window.setTimeout(() => {
        d({ type: 'lumen', line: { from: 'lumen', text, t: Date.now() } })
        d({ type: 'toast', toast: { from: 'Lumen', text, app: 'messages' } })
        sfx.notify()
      }, delay)
    }
    const open = (app: AppId, payload?: string) => {
      const meta = APP_META[app]
      const title = app === 'txt' && payload ? payload : meta.title
      d({ type: 'open', app, title, w: meta.w, h: meta.h, payload })
      sfx.open()
      log(`opened ${title}`)
    }
    const solve = (f: Fragment, note: string) => {
      const cur = sRef.current.fragments
      if (cur[f]) return
      const n = FRAGMENTS.filter((x) => cur[x]).length + 1
      sRef.current = { ...sRef.current, fragments: { ...cur, [f]: true } }
      d({ type: 'solve', f })
      d({ type: 'glitch' })
      sfx.success()
      log(note)
      d({ type: 'toast', toast: { from: 'System Recovery', text: `Fragment recovered (${n}/4)`, app: 'deleteme' } })
    }
    return { log, say, open, solve }
  }, [])

  const ctx = useMemo<Ctx>(() => ({
    s, d, ...fns,
    solvedCount: FRAGMENTS.filter((f) => s.fragments[f]).length,
  }), [s, fns])

  return <GameCtx.Provider value={ctx}>{children}</GameCtx.Provider>
}

export function useGame() {
  const c = useContext(GameCtx)
  if (!c) throw new Error('useGame outside provider')
  return c
}

export const fmtTime = (t: number) =>
  new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
