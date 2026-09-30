import { useState } from 'react'
import { DOCS, JOURNAL, JOURNAL_PASSWORD } from '../story'
import { useGame } from '../store'
import { Icon } from '../Icon'
import { sfx } from '../audio'

export function Documents() {
  const { s, solve, log, say } = useGame()
  const [sel, setSel] = useState('todo.txt')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [tries, setTries] = useState(0)
  const doc = DOCS[sel]
  const unlocked = s.fragments.journal

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const guess = pw.trim().toLowerCase()
    log(`typed journal password: "${pw}"`)
    if (guess === JOURNAL_PASSWORD) {
      setErr('')
      solve('journal', 'unlocked journal.lock')
      say('she wrote about me in there? she always said i was the only one who listened.', 1800)
    } else {
      sfx.error()
      setTries((t) => t + 1)
      setErr(tries >= 1 ? 'Wrong password. Her todo list says where the word comes from.' : 'Wrong password.')
      setPw('')
    }
  }

  return (
    <div className="app split">
      <ul className="file-list" role="listbox" aria-label="Documents">
        {Object.entries(DOCS).map(([name, d]) => (
          <li key={name}>
            <button className={`file-row ${sel === name ? 'is-sel' : ''}`} onClick={() => { sfx.click(); setSel(name); log(`selected ${name}`) }}>
              <Icon name={d.kind === 'lock' ? (unlocked ? 'txt' : 'lock') : d.kind === 'pdf' ? 'pdf' : 'txt'} size={22} />
              <span className="fname">{name === 'journal.lock' && unlocked ? 'journal.txt' : name}</span>
              <span className="fmeta">{d.date}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="preview">
        <div className="preview-head">
          <span>{sel === 'journal.lock' && unlocked ? 'journal.txt' : sel}</span>
          <span className="muted">{doc.size}</span>
        </div>
        {doc.kind === 'lock' && !unlocked ? (
          <form className="lockbox" onSubmit={submit}>
            <Icon name="lock" size={44} />
            <p><b>journal.lock is encrypted.</b><br />Enter the password to open it.</p>
            <label htmlFor="journal-pw" className="sr-only">Password</label>
            <input
              id="journal-pw"
              value={pw}
              onChange={(e) => { setPw(e.target.value); sfx.key() }}
              placeholder="password"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="btn">Unlock</button>
            {err && <p className="err" role="alert">{err}</p>}
          </form>
        ) : (
          <pre className="doc-text">{doc.kind === 'lock' ? JOURNAL : doc.body}</pre>
        )}
      </div>
    </div>
  )
}
