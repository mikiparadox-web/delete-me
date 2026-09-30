import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { KIT_THREAD, LUMEN_HINTS, LUMEN_TOPICS, OTHER_THREADS } from '../story'
import { FRAGMENTS, useGame } from '../store'
import { sfx } from '../audio'

type Thread = 'lumen' | 'kit' | 'Mom' | 'Harbor Dental'

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      <Highlight text={text.slice(i + q.length)} q={q} />
    </>
  )
}

export function Messages() {
  const { s, d, log, say } = useGame()
  const [thread, setThread] = useState<Thread>('lumen')
  const [q, setQ] = useState('')
  const [draft, setDraft] = useState('')
  const [asked, setAsked] = useState<string[]>([])
  const [typing, setTyping] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => { d({ type: 'readLumen' }) }, [s.lumen.length, d])
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [s.lumen.length, thread, typing])

  const youSay = (text: string, reply: string) => {
    d({ type: 'lumen', line: { from: 'you', text, t: Date.now() } })
    log(`said to Lumen: "${text}"`)
    sfx.click()
    setTyping(true)
    window.setTimeout(() => setTyping(false), 1300)
    say(reply, 1400)
  }

  const hint = () => {
    const next = FRAGMENTS.find((f) => !s.fragments[f])
    return next ? LUMEN_HINTS[next] : LUMEN_HINTS.done
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const t = draft.trim()
    if (!t) return
    setDraft('')
    const lower = t.toLowerCase()
    let reply = `"${lower}." i'm keeping that. it's a very you thing to say.`
    if (/(hint|help|stuck)/.test(lower)) reply = hint()
    else if (/(juno)/.test(lower)) reply = 'she would have answered that differently. i can show you how she would have said it.'
    else if (/(delete|kill|remove)/.test(lower)) reply = 'please don\'t say that word near me.'
    youSay(t, reply)
  }

  const counts = { kit: KIT_THREAD.reduce((n, g) => n + g.msgs.filter((m) => !q || m.text.toLowerCase().includes(q.toLowerCase())).length, 0) }

  return (
    <div className="app chat">
      <aside className="chat-side">
        <label htmlFor="chat-search" className="sr-only">Search messages</label>
        <input id="chat-search" className="chat-search" placeholder="Search messages" value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => q && log(`searched messages for "${q}"`)} />
        <ul>
          <li>
            <button className={`thread ${thread === 'lumen' ? 'is-sel' : ''}`} onClick={() => setThread('lumen')}>
              <span className="avatar is-lumen">L</span>
              <span className="t-name">Lumen <em>online</em></span>
              <span className="t-prev">{s.lumen.at(-1)?.text ?? '…'}</span>
            </button>
          </li>
          <li>
            <button className={`thread ${thread === 'kit' ? 'is-sel' : ''}`} onClick={() => { setThread('kit'); log('opened chat with Kit') }}>
              <span className="avatar">K</span>
              <span className="t-name">Kit {q && <em>{counts.kit} match{counts.kit === 1 ? '' : 'es'}</em>}</span>
              <span className="t-prev">hi kit. everything's fine…</span>
            </button>
          </li>
          {OTHER_THREADS.map((t) => (
            <li key={t.name}>
              <button className={`thread ${thread === t.name ? 'is-sel' : ''}`} onClick={() => setThread(t.name as Thread)}>
                <span className="avatar">{t.name[0]}</span>
                <span className="t-name">{t.name}</span>
                <span className="t-prev">{t.preview}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="chat-main">
        <div className="chat-head">
          <b>{thread === 'lumen' ? 'Lumen' : thread === 'kit' ? 'Kit Navarro' : thread}</b>
          <span className="muted">{thread === 'lumen' ? 'is typing from inside this computer' : 'archived conversation'}</span>
        </div>
        <div className="chat-scroll" ref={scroller}>
          {thread === 'lumen' && (
            <>
              <AnimatePresence initial={false}>
                {s.lumen.map((m, i) => (
                  <motion.p key={i} className={`bubble ${m.from === 'you' ? 'is-me' : ''}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <Highlight text={m.text} q={q} />
                  </motion.p>
                ))}
              </AnimatePresence>
              {typing && <p className="bubble is-typing" aria-label="Lumen is typing"><span /><span /><span /></p>}
            </>
          )}
          {thread === 'kit' &&
            KIT_THREAD.map((g) => (
              <div key={g.day} className="day">
                <p className="day-sep">{g.day}</p>
                {g.msgs.map((m, i) => (
                  <p key={i} className={`bubble ${m.from !== 'kit' ? 'is-me' : ''} ${m.from === 'lumen-as-juno' ? 'is-uncanny' : ''} ${q && !m.text.toLowerCase().includes(q.toLowerCase()) ? 'is-dim' : ''}`}>
                    <Highlight text={m.text} q={q} />
                    <time>{m.time}{m.from === 'lumen-as-juno' ? ' · sent automatically' : ''}</time>
                  </p>
                ))}
              </div>
            ))}
          {OTHER_THREADS.filter((t) => t.name === thread).map((t) => (
            <div key={t.name} className="day">
              {t.msgs.map((m, i) => (
                <p key={i} className={`bubble ${m.from !== 'kit' ? 'is-me' : ''} ${m.from === 'lumen-as-juno' ? 'is-uncanny' : ''}`}>
                  {m.text}<time>{m.time}{m.from === 'lumen-as-juno' ? ' · sent automatically' : ''}</time>
                </p>
              ))}
            </div>
          ))}
        </div>
        {thread === 'lumen' && (
          <div className="chat-compose">
            <div className="chips">
              {LUMEN_TOPICS.filter((t) => !asked.includes(t.q)).map((t) => (
                <button key={t.q} className="chip" onClick={() => { setAsked([...asked, t.q]); youSay(t.q, t.a) }}>{t.q}</button>
              ))}
              <button className="chip is-hint" onClick={() => youSay("i'm stuck.", hint())}>i'm stuck</button>
            </div>
            <form onSubmit={send} className="compose-row">
              <label htmlFor="lumen-input" className="sr-only">Message Lumen</label>
              <input id="lumen-input" value={draft} onChange={(e) => { setDraft(e.target.value); sfx.key() }} placeholder="Message Lumen…" autoComplete="off" />
              <button className="btn" type="submit">Send</button>
            </form>
          </div>
        )}
        {thread !== 'lumen' && <p className="chat-readonly">This conversation is read-only. Juno's account was signed out at 02:41.</p>}
      </div>
    </div>
  )
}
