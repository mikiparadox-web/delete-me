import { useRef, useState } from 'react'
import { Icon, type IconName } from '../Icon'
import { MEMOS } from '../story'
import { fmtTime, useGame } from '../store'
import { sfx } from '../audio'

function Grid({ items }: { items: { name: string; icon: IconName; sub?: string; onOpen: () => void }[] }) {
  const ptr = useRef('mouse')
  return (
    <ul className="folder-grid">
      {items.map((it) => (
        <li key={it.name}>
          <button className="folder-item" onDoubleClick={it.onOpen} onPointerDown={(e) => (ptr.current = e.pointerType)} onClick={(e) => { if (e.detail === 0 || ptr.current !== 'mouse') it.onOpen() }}>
            <Icon name={it.icon} size={44} />
            <span>{it.name}</span>
            {it.sub && <small>{it.sub}</small>}
          </button>
        </li>
      ))}
    </ul>
  )
}

export function Memories() {
  const { s, open } = useGame()
  if (!s.fragments.terminal) {
    return (
      <div className="app locked-view">
        <Icon name="folder-lock" size={72} />
        <h3>Memories is encrypted</h3>
        <p>Juno locked this folder on 11 Oct. To unlock it, open <b>System → terminal.exe</b> and type the restore key.</p>
        <button className="btn" onClick={() => open('system')}>Open System</button>
      </div>
    )
  }
  return (
    <div className="app">
      <div className="app-toolbar"><span className="crumb">Memories</span><span className="muted">double-click to open</span></div>
      <Grid
        items={[
          ...Object.entries(MEMOS).map(([name, m]) => ({ name, icon: 'audio' as IconName, sub: m.date, onOpen: () => open('txt', name) })),
          { name: 'kit_and_me.jpg', icon: 'image', sub: '12 Oct 2025', onOpen: () => open('txt', 'kit_and_me.jpg') },
        ]}
      />
    </div>
  )
}

export function SystemFolder() {
  const { open, d, say, log } = useGame()
  const [poked, setPoked] = useState(false)
  return (
    <div className="app">
      <div className="app-toolbar"><span className="crumb">System</span><span className="muted">double-click to open</span></div>
      <Grid
        items={[
          { name: 'terminal.exe', icon: 'terminal', onOpen: () => open('terminal') },
          { name: 'readme.sys', icon: 'txt', onOpen: () => open('txt', 'readme.sys') },
          {
            name: 'lumen.core', icon: 'gear', sub: 'in use', onOpen: () => {
              d({ type: 'glitch' }); sfx.glitch(); log('tried to open lumen.core')
              if (!poked) { setPoked(true); say("please don't touch that. it's me.", 500) }
            },
          },
        ]}
      />
    </div>
  )
}

const today = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export function Trash() {
  const { s, solve, log, say, open, d } = useGame()
  const [restored, setRestored] = useState<string[]>(s.fragments.trash ? ['session.log'] : [])
  const [note, setNote] = useState('Trash empties automatically at 03:00 every night.')
  const items = [
    { name: 'old_resume_v3.pdf', date: '04 Jun 2025, 14:10', size: '212 KB', icon: 'pdf' as IconName },
    { name: 'harbor_blurry.jpg', date: '09 Oct 2025, 20:02', size: '3.1 MB', icon: 'image' as IconName },
    { name: 'kit_voicemail.m4a', date: '11 Oct 2025, 22:47', size: '640 KB', icon: 'audio' as IconName },
    { name: 'session.log', date: `${today()}, ${fmtTime(Date.now()).slice(0, 5)}`, size: `${s.log.length} lines`, icon: 'log' as IconName },
    { name: 'lumen_backup_old.core', date: '10 Oct 2025, 01:15', size: '1.4 GB', icon: 'gear' as IconName },
  ]
  const restore = (name: string) => {
    log(`restored ${name} from Trash`)
    setRestored((r) => [...r, name])
    if (name === 'session.log') {
      solve('trash', 'restored session.log — a file dated after 02:41')
      say("you found my notes. yes, i write down everything you do. that's how i learn. that's how she got so small.", 2200)
      window.setTimeout(() => open('txt', 'session.log'), 500)
      setNote('session.log restored. It was written after Juno left.')
    } else if (name === 'lumen_backup_old.core') {
      sfx.glitch(); d({ type: 'glitch' })
      setNote('lumen_backup_old.core refused to restore: "one of me is enough."')
    } else {
      sfx.click()
      setNote(`${name} restored. Just an old file of Juno's. Nothing changed.`)
    }
  }
  return (
    <div className="app">
      <div className="app-toolbar"><span className="crumb">Trash</span><span className="muted">{items.length - restored.length} items</span></div>
      <div className="table-wrap">
        <table className="trash-table">
          <thead><tr><th>Name</th><th>Deleted</th><th>Size</th><th /></tr></thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.name} className={restored.includes(it.name) ? 'is-restored' : ''}>
                <td><span className="cell-name"><Icon name={it.icon} size={20} />{it.name}</span></td>
                <td className="num">{it.date}</td>
                <td className="num">{it.size}</td>
                <td>
                  {restored.includes(it.name)
                    ? (it.name === 'session.log' ? <button className="btn-link" onClick={() => open('txt', 'session.log')}>Open</button> : <span className="muted">restored</span>)
                    : <button className="btn-link" onClick={() => restore(it.name)}>Restore</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="app-note" role="status">{note}</p>
    </div>
  )
}

