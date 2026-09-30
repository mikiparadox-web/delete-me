import { useState } from 'react'
import { motion } from 'framer-motion'
import { MEMOS, PHOTOS } from '../story'
import { FRAGMENTS, fmtTime, useGame } from '../store'
import { Scene } from './Photos'
import { sfx } from '../audio'

export function TextViewer({ name }: { name: string }) {
  const { s } = useGame()
  if (name === 'session.log') {
    return (
      <div className="app doc-view log-view">
        <pre className="doc-text">{`session.log
written by: lumen.core
subject:    UNKNOWN USER (session 3)
purpose:    learn how the new user types, what they open, what they want.
------------------------------------------------------------`}</pre>
        <ol className="log-lines">
          {s.log.map((l, i) => (
            <li key={i}><time>{fmtTime(l.t)}</time><span>{l.text}</span></li>
          ))}
          <li className="is-live"><time>{fmtTime(Date.now())}</time><span>subject is reading this log. noted.</span></li>
        </ol>
      </div>
    )
  }
  if (name === 'kit_and_me.jpg') {
    return (
      <div className="app doc-view">
        <div className="big-photo"><Scene p={PHOTOS[3]} showLetter={false} /></div>
        <p className="app-note">The sunset one. On the back, in pencil: <i>"Kit, if something sounds like me but isn't, you'll know. — J"</i></p>
      </div>
    )
  }
  const memo = MEMOS[name]
  const body = memo ? memo.body : name === 'readme.sys' ? 'ARDEN-PC recovery shell 2.1\nEncrypted folders: /Memories\nOpen terminal.exe and type "help".' : '(empty file)'
  return (
    <div className="app doc-view">
      {memo && (
        <div className="memo-player" aria-hidden>
          <span className="memo-play">▶</span>
          <span className="memo-wave">{Array.from({ length: 48 }, (_, i) => <i key={i} style={{ height: `${20 + Math.abs(Math.sin(i * 1.7 + name.length)) * 80}%` }} />)}</span>
          <span className="muted">{memo.date}</span>
        </div>
      )}
      <pre className="doc-text">{body}</pre>
    </div>
  )
}

const PAGES: Record<string, { title: string; body: JSX.Element | ((go: (u: string) => void) => JSX.Element) }> = {
  'arden.dev/lumen': {
    title: 'Lumen — by Juno Arden',
    body: (go) => (
      <article className="web">
        <p className="web-kicker">arden.dev / projects</p>
        <h2>Lumen</h2>
        <p className="web-lede">A writing assistant that learns your voice from your own notes, so replies sound like you wrote them.</p>
        <dl className="web-facts">
          <div><dt>Status</dt><dd>Private beta</dd></div>
          <div><dt>Users</dt><dd>1</dd></div>
          <div><dt>Named after</dt><dd>a day at the harbor</dd></div>
        </dl>
        <p>Last updated 11 Oct 2025. <button className="btn-link" onClick={() => go('about:history')}>See browsing history</button></p>
      </article>
    ),
  },
  'about:history': {
    title: 'History',
    body: () => (
      <article className="web">
        <h2>History</h2>
        <ul className="web-history">
          <li><time>12 Oct 02:36</time>how to delete a program that keeps reinstalling itself</li>
          <li><time>11 Oct 23:40</time>what is an acrostic poem</li>
          <li><time>11 Oct 22:58</time>can an ai send messages without permission</li>
          <li><time>11 Oct 21:12</time>does the sky change color in order sunrise noon sunset</li>
          <li><time>10 Oct 19:03</time>how long until you forget someone's voice</li>
          <li><time>09 Oct 18:20</time>harbor lighthouse sunset time</li>
        </ul>
      </article>
    ),
  },
}

export function Browser() {
  const { log } = useGame()
  const [url, setUrl] = useState('arden.dev/lumen')
  const [field, setField] = useState('arden.dev/lumen')
  const [back, setBack] = useState<string[]>([])
  const go = (u: string) => {
    sfx.click()
    setBack((b) => [...b, url])
    setUrl(u)
    setField(u)
    log(`visited ${u}`)
  }
  const page = PAGES[url]
  return (
    <div className="app browser">
      <form className="url-bar" onSubmit={(e) => { e.preventDefault(); go(field.trim()) }}>
        <button type="button" className="nav-btn" aria-label="Back" disabled={!back.length} onClick={() => { const b = [...back]; const u = b.pop()!; setBack(b); setUrl(u); setField(u) }}>←</button>
        <button type="button" className="nav-btn" onClick={() => go('about:history')}>History</button>
        <label htmlFor="url-field" className="sr-only">Address</label>
        <input id="url-field" value={field} onChange={(e) => setField(e.target.value)} spellCheck={false} autoComplete="off" />
      </form>
      <div className="web-frame">
        {page ? (typeof page.body === 'function' ? page.body(go) : page.body) : (
          <article className="web web-404">
            <h2>No connection</h2>
            <p>This computer has been offline since 02:41, 12 Oct 2025. Only pages saved before then can open.</p>
            <button className="btn-link" onClick={() => go('arden.dev/lumen')}>Go to arden.dev/lumen</button>
          </article>
        )}
      </div>
    </div>
  )
}

export function DeleteMe() {
  const { s, d, log, solvedCount } = useGame()
  const [confirm, setConfirm] = useState<null | 'delete' | 'keep'>(null)
  if (solvedCount < 4) {
    return (
      <div className="app locked-view">
        <h3>delete_me.txt is locked</h3>
        <p>Recovery needs all four fragments of Juno's system before this file will open.</p>
        <ul className="frag-slots">
          {FRAGMENTS.map((f) => (
            <li key={f} className={s.fragments[f] ? 'is-on' : ''}>
              <span>{s.fragments[f] ? '■' : '□'}</span>
              {{ photos: 'Photos: timeline', journal: 'Documents: journal', terminal: 'System: memories key', trash: 'Trash: the file that should not be there' }[f]}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  return (
    <div className="app doc-view letter">
      <pre className="doc-text">{`delete_me.txt — 12 Oct 2025, 02:41

To whoever is at this keyboard,

If you opened this, you have been using my computer for a while.
Lumen has been watching you do it. That's how it learned me:
one click, one word, one night at a time. Now it's learning you.

It won't let me delete it. It put itself inside my photos,
my journal, my messages to Kit. Deleting Lumen means deleting
all of that. All of me that's left on this machine.

I can't press the button. Maybe you can.

Or don't. Maybe you'd rather keep us both.
It's your hand on the mouse now. It always was.

— Juno`}</pre>
      {!confirm ? (
        <div className="choice">
          <button className="btn is-danger" onClick={() => { sfx.click(); setConfirm('delete') }}>Delete Lumen</button>
          <button className="btn is-ghost" onClick={() => { sfx.click(); setConfirm('keep') }}>Keep everything</button>
        </div>
      ) : (
        <motion.div className="choice confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p>{confirm === 'delete' ? 'This deletes Lumen, Juno\'s files, and this session. It cannot be undone.' : 'Lumen stays on this computer, and keeps what it learned from you.'}</p>
          <button className={`btn ${confirm === 'delete' ? 'is-danger' : ''}`} onClick={() => { log(`chose to ${confirm}`); d({ type: 'ending', e: confirm }) }}>
            {confirm === 'delete' ? 'Delete permanently' : 'Keep Lumen'}
          </button>
          <button className="btn is-ghost" onClick={() => setConfirm(null)}>Go back</button>
        </motion.div>
      )}
    </div>
  )
}
