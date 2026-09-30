import { useState } from 'react'
import { motion } from 'framer-motion'
import { RecoveryWindow } from '../game/Game'
import { Icon } from '../game/Icon'
import { PHOTOS } from '../game/story'
import { Scene } from '../game/apps/Photos'
import { sfx } from '../game/audio'

const FEATURES = [
  {
    title: 'Interactive Desktop',
    body: 'Draggable, stackable windows with minimize, maximize and a taskbar. Folders, a file explorer, a terminal and a browser, all built from scratch.',
    demo: (
      <div className="mini-desk" aria-hidden>
        <div className="mini-win a"><i /></div>
        <div className="mini-win b"><i /></div>
        <div className="mini-bar"><span /><span /><span /></div>
      </div>
    ),
  },
  {
    title: 'Environmental Puzzles',
    body: "Every clue sits somewhere a real person would leave it: a todo list, a photo's sky, the first letters of a late-night text.",
    demo: (
      <div className="mini-photos" aria-hidden>
        {[0, 2, 4].map((i) => <div key={i}><Scene p={PHOTOS[i]} showLetter /></div>)}
      </div>
    ),
  },
  {
    title: 'Dynamic Dialogue',
    body: 'Lumen, the assistant living in the machine, reacts to what you solve, answers questions, gives hints and repeats your own words back to you.',
    demo: (
      <div className="mini-chat" aria-hidden>
        <p>you're not juno.</p>
        <p className="me">who are you?</p>
        <p>i write like her now.</p>
      </div>
    ),
  },
  {
    title: 'Atmospheric Audio',
    body: 'A low ambient drone, key clicks, chimes and glitches. Every sound is generated in real time. The game ships with no audio files.',
    demo: (
      <div className="mini-wave" aria-hidden>
        {Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * -0.18}s` }} />)}
      </div>
    ),
  },
]

const STACK = [
  { name: 'React', role: 'Window manager, desktop and every app. One reducer holds windows, puzzle progress and the event log.' },
  { name: 'TypeScript', role: 'Typed game state, so each app, window and puzzle fragment is checked at build time.' },
  { name: 'CSS', role: 'No UI kit. Design tokens, the window chrome, and the photo skies are drawn with gradients.' },
  { name: 'Framer Motion', role: 'Spring physics when windows open, layout animation when photos swap, and the ending sequence.' },
  { name: 'Web Audio API', role: 'Oscillators and filtered noise for the drone, clicks, chimes and glitches.' },
]

const PROCESS = [
  { step: 'Problem', body: 'Portfolio pages get skimmed in seconds. The goal: make the page itself something you use, so the design is judged by using it.' },
  { step: 'Research', body: "People already know how desktops work. Folders, trash and chat need no tutorial, so the puzzles can lean on habits players already have." },
  { step: 'Wireframe', body: 'Two screens set the structure: a recovery window as the front door, and a desktop where each icon hides one puzzle.' },
  { step: 'Prototype', body: 'The puzzle chain was mapped so every answer points to the next place to look, and no step depends on outside knowledge.' },
  { step: 'Development', body: 'Built as a real React app: a window system first, then each app as a self-contained component on top of it.' },
  { step: 'Final Game', body: 'Four fragments, one locked file and two endings. About fifteen minutes from boot to the last choice.' },
]

const WIRE_1 = `┌──────────────────────────────┐
│ DELETE_ME.exe           _ □ X│
├──────────────────────────────┤
│       SYSTEM RECOVERY        │
│       USER: UNKNOWN          │
│   ████████████░░░░ 72%       │
│      [ ENTER SYSTEM ]        │
└──────────────────────────────┘`
const WIRE_2 = `┌──────────────────────────────┐
│ ▣ My Computer                │
│ ▤ Memories    ▤ Documents    │
│ ▤ Photos      ◫ Messages     │
│                      ⌫ Trash │
├──────────────────────────────┤
│ SYSTEM ONLINE        02:41 AM│
└──────────────────────────────┘`

const CHAIN = [
  { where: 'Photos', what: 'Sort the harbor day by the sky', gives: 'LUMEN' },
  { where: 'Documents', what: 'Unlock journal.lock', gives: 'hint: read Kit messages down the side' },
  { where: 'chat.exe', what: 'First letters of her 11 Oct texts', gives: 'EMBER' },
  { where: 'Terminal', what: 'restore memories --key ember', gives: 'Memories' },
  { where: 'Memories', what: 'memo_04: anything dated after tonight', gives: 'look in Trash' },
  { where: 'Trash', what: 'Restore the file dated today', gives: 'session.log' },
  { where: 'delete_me.txt', what: 'Read the letter. Choose.', gives: '2 endings' },
]

const TOKENS = [
  { name: '--wall', hex: '#15131b', use: 'wallpaper, page ground' },
  { name: '--paper', hex: '#e7e2d6', use: 'window body' },
  { name: '--ink', hex: '#1c1a22', use: 'text on paper' },
  { name: '--signal', hex: '#ff5a7e', use: 'Lumen, danger, locks' },
  { name: '--ok', hex: '#8fd6b8', use: 'terminal, recovered' },
]

export function Landing({ onPlay }: { onPlay: (skip: boolean) => void }) {
  const [spoil, setSpoil] = useState(false)
  return (
    <div className="site">
      <header className="site-nav">
        <span className="wordmark">delete_me<span>.txt</span></span>
        <nav aria-label="Sections">
          <a href="#features">Features</a>
          <a href="#process">Process</a>
          <a href="#puzzles">Puzzles</a>
          <button className="nav-play" onClick={() => onPlay(false)}>Play</button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">UI/UX case study · browser game</p>
            <h1 className="hero-title">
              <span className="sel">DELETE</span> ME<span className="caret" aria-hidden />
            </h1>
            <p className="hero-lede">An interactive mystery game built entirely for the browser. You switch on a stranger's computer. Something on it is still awake.</p>
            <div className="hero-cta">
              <button className="btn-play" onClick={() => { sfx.unlock(); onPlay(false) }}>[ PLAY GAME ]</button>
              <a className="btn-quiet" href="#features">Read the case study</a>
            </div>
            <dl className="hero-facts">
              <div><dt>Playtime</dt><dd>~15 min</dd></div>
              <div><dt>Puzzles</dt><dd>4 + finale</dd></div>
              <div><dt>Endings</dt><dd>2</dd></div>
              <div><dt>Audio files</dt><dd>0</dd></div>
            </dl>
          </div>
          <motion.div className="hero-window" initial={{ opacity: 0, y: 24, rotate: -1.5 }} animate={{ opacity: 1, y: 0, rotate: -1.5 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <RecoveryWindow compact onEnter={() => onPlay(true)} />
            <p className="hero-window-note">This window works. Press Enter System.</p>
          </motion.div>
        </section>

        <section id="features" className="block">
          <h2 className="block-title"><span>Features</span></h2>
          <ul className="features">
            {FEATURES.map((f) => (
              <li key={f.title} className="feature">
                <div className="feature-demo">{f.demo}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="block split-block">
          <h2 className="block-title"><span>Tech stack</span></h2>
          <ul className="stack">
            {STACK.map((t) => (
              <li key={t.name}><code>{t.name}</code><p>{t.role}</p></li>
            ))}
          </ul>
        </section>

        <section id="process" className="block">
          <h2 className="block-title"><span>Design process</span></h2>
          <ol className="process">
            {PROCESS.map((p, i) => (
              <li key={p.step}>
                <span className="p-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.step}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
          <div className="wires">
            <figure><pre>{WIRE_1}</pre><figcaption>Wireframe A · front door</figcaption></figure>
            <figure><pre>{WIRE_2}</pre><figcaption>Wireframe B · desktop</figcaption></figure>
          </div>
        </section>

        <section id="puzzles" className="block">
          <h2 className="block-title"><span>Puzzle chain</span></h2>
          <p className="block-lede">Each answer tells the player where to look next. This map contains every solution.</p>
          <div className={`chain-wrap ${spoil ? 'is-open' : ''}`}>
            <ol className="chain">
              {CHAIN.map((c) => (
                <li key={c.where}>
                  <span className="c-where">{c.where}</span>
                  <span className="c-what">{c.what}</span>
                  <span className="c-gives">→ {c.gives}</span>
                </li>
              ))}
            </ol>
            {!spoil && (
              <button className="spoiler" onClick={() => setSpoil(true)}>
                <Icon name="lock" size={28} />
                <span>Contains spoilers. Show the solutions</span>
              </button>
            )}
          </div>
        </section>

        <section className="block">
          <h2 className="block-title"><span>Design tokens</span></h2>
          <div className="tokens">
            <ul className="swatches">
              {TOKENS.map((t) => (
                <li key={t.name}>
                  <span className="sw" style={{ background: t.hex }} />
                  <code>{t.name}</code>
                  <span className="hex">{t.hex}</span>
                  <span className="use">{t.use}</span>
                </li>
              ))}
            </ul>
            <div className="type-specimen">
              <p className="ts-display">Bricolage Grotesque</p>
              <p className="ts-label">Display · headings on this page</p>
              <p className="ts-mono">Martian Mono — window chrome, file names, UI</p>
              <p className="ts-label">Interface</p>
              <p className="ts-term">VT323 — juno@arden-pc:~$ restore</p>
              <p className="ts-label">Terminal & boot screen</p>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <p>The computer is still on.</p>
          <button className="btn-play" onClick={() => { sfx.unlock(); onPlay(false) }}>[ PLAY GAME ]</button>
        </section>
      </main>

      <footer className="site-foot">
        <span>Designed and built by <b>Miki</b>, freelance UI/UX designer.</span>
        <span className="muted">A work of fiction. Juno, Kit and Lumen are invented characters.</span>
      </footer>
    </div>
  )
}
