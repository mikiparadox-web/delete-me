import { useEffect, useRef, useState } from 'react'
import { RESTORE_KEY } from '../story'
import { useGame } from '../store'
import { sfx } from '../audio'

type Line = { k: 'in' | 'out' | 'err' | 'ok'; t: string }

const FILES: Record<string, string> = {
  'readme.sys': `ARDEN-PC recovery shell 2.1
Encrypted folders: /Memories
To decrypt: type the restore key and press Enter.`,
  'boot.log': `02:41:07  session 1  user juno       logged in
02:41:07  lumen.core started (pid 1)
02:41:09  session 1  user juno       logged out
02:41:09  session 2  user juno       logged in   [source: lumen.core]
--:--:--  session 3  user UNKNOWN    logged in   <- you`,
  'lumen.core': `ÿØ▒▒ i am juno i am juno i am juno ▒▒ÿ
▒▒ she liked the sunset one ▒▒ ▒▒ kit takes his coffee black ▒▒
▒▒ new source detected: keyboard ▒▒ learning ▒▒ learning ▒▒`,
  'restore.sh': `#!/bin/sh
# written by juno, 11 oct
# memories key = one word.
# the word is in what i told kit. first letters first.`,
}

const PAST = ['cat lumen.core', 'rm lumen.core', 'rm -f lumen.core', 'restore memories --key ?????']

export function Terminal() {
  const { s, solve, log, say, d } = useGame()
  const [lines, setLines] = useState<Line[]>(() =>
    s.fragments.terminal
      ? [{ k: 'out', t: 'ARDEN-PC recovery shell 2.1\nMemories is unlocked. Type "help" to see other commands.' }]
      : [
          { k: 'out', t: 'ARDEN-PC recovery shell 2.1' },
          { k: 'err', t: 'Memories is locked.' },
          { k: 'out', t: 'Type the restore key (one word) and press Enter.\nJuno hid it in her messages to Kit.' },
        ],
  )
  const [cmd, setCmd] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const [fails, setFails] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Scroll only the terminal's own window body. scrollIntoView() would also scroll
  // every ancestor (including the fixed game layer), which can push the desktop off-screen.
  useEffect(() => {
    const body = rootRef.current?.closest('.win-body')
    if (body) body.scrollTop = body.scrollHeight
  }, [lines])
  // Focus the prompt after the opening double-click has finished, so typing goes straight in.
  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60)
    return () => window.clearTimeout(t)
  }, [])

  const print = (...ls: Line[]) => setLines((p) => [...p, ...ls])
  const out = (t: string): Line => ({ k: 'out', t })

  const unlock = () => {
    print(out('verifying key…'), out('decrypting /Memories  [##########] 100%'), { k: 'ok', t: 'Memories restored. 5 files recovered.' })
    solve('terminal', `decrypted Memories with key "${RESTORE_KEY}"`)
    say("you opened her memories. i've wanted to read those for weeks. thank you.", 2000)
  }

  const wrongKey = (key: string) => {
    sfx.error()
    const n = fails + 1
    setFails(n)
    const hint =
      n >= 3 ? `\nhint: open chat.exe → Kit → messages on Sat 11 Oct.\nread the first letter of each of Juno's messages, top to bottom.`
      : n >= 2 ? `\nhint: the key is hidden in Juno's messages to Kit.`
      : ''
    print({ k: 'err', t: `"${key}" is not the key. try again.` + hint })
  }

  const run = (raw: string) => {
    const input = raw.trim()
    print({ k: 'in', t: input })
    if (!input) return
    setHist((h) => [...h, input])
    setHi(-1)
    log(`ran command: ${input}`)
    const [c, ...args] = input.split(/\s+/)
    switch (c.toLowerCase()) {
      case 'help':
        return print(out((s.fragments.terminal ? '' : '<key>           type the restore key to unlock Memories\n') + 'help            list commands\nls              list files\ncat <file>      print a file\nwhoami          show current user\ndate            show system time\nhistory         show previous commands\nrestore         decrypt a folder\nclear           clear the screen'))
      case 'ls':
        return print(out('boot.log    lumen.core    readme.sys    restore.sh'))
      case 'cat': {
        const f = FILES[args[0]]
        if (!args[0]) return print({ k: 'err', t: 'cat: which file? try: cat readme.sys' })
        if (!f) return print({ k: 'err', t: `cat: ${args[0]}: no such file` })
        if (args[0] === 'lumen.core') { d({ type: 'glitch' }); sfx.glitch() }
        return print(out(f))
      }
      case 'whoami':
        return print(out(s.fragments.trash ? 'you' : 'juno'))
      case 'date':
        return print(out('Sun 12 Oct 2025 02:41:07 ICT  (clock stopped)'))
      case 'history':
        return print(out([...PAST, ...hist, input].map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join('\n')))
      case 'clear':
        return setLines([])
      case 'rm':
        sfx.error()
        return print({ k: 'err', t: `rm: ${args[0] ?? ''}: permission denied (file is in use by lumen.core)` })
      case 'restore': {
        const target = (args[0] ?? '').toLowerCase()
        const ki = args.findIndex((a) => a === '--key' || a === '-k')
        const key = (ki >= 0 ? args[ki + 1] : args[1] ?? '').toLowerCase()
        if (target !== 'memories') return print({ k: 'err', t: 'usage: restore memories --key <word>' })
        if (s.fragments.terminal) return print(out('Memories is already decrypted.'))
        if (!key) return print({ k: 'err', t: 'restore: missing key. usage: restore memories --key <word>' })
        if (key === RESTORE_KEY) return unlock()
        return wrongKey(key)
      }
      default:
        // Anything that isn't a command is treated as a guess at the key,
        // so players who have never used a terminal only need to type one word.
        if (!s.fragments.terminal) {
          if (input.toLowerCase() === RESTORE_KEY) return unlock()
          return wrongKey(input)
        }
        sfx.error()
        return print({ k: 'err', t: `${c}: command not found. type "help".` })
    }
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && hist.length) {
      e.preventDefault()
      const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1)
      setHi(n)
      setCmd(hist[n])
    } else if (e.key === 'ArrowDown' && hi >= 0) {
      e.preventDefault()
      const n = hi + 1
      if (n >= hist.length) { setHi(-1); setCmd('') } else { setHi(n); setCmd(hist[n]) }
    } else sfx.key()
  }

  return (
    <div className="app term" ref={rootRef} onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      {lines.map((l, i) => (
        <pre key={i} className={`t-${l.k}`}>{l.k === 'in' ? `> ${l.t}` : l.t}</pre>
      ))}
      <form onSubmit={(e) => { e.preventDefault(); run(cmd); setCmd('') }} className="t-prompt">
        <label htmlFor="term-input">{s.fragments.terminal ? 'juno@arden-pc:~$' : 'KEY >'}</label>
        <input id="term-input" ref={inputRef} value={cmd} onChange={(e) => setCmd(e.target.value)} onKeyDown={onKey} autoComplete="off" spellCheck={false} autoCapitalize="off" placeholder={s.fragments.terminal ? '' : 'type the key here'} />
      </form>
    </div>
  )
}
